import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';

import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';
import { ShoppingOutlined } from '@ant-design/icons';
// project imports
import MainCard from '../MainCard';

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({ navigation, title, ...others }) => {
  const location = useLocation();
  const [item, setItem] = useState();

  const instance = axios.create({
    baseURL: useAxiosStore.getState().baseURL
  });

  const [menuItems, setMenuItems] = useState([]); //eslint-disable-line no-unused-vars

  // set active item state
  const getCollapse = (menu) => {
    if (menu.children) {
      menu.children.filter((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type && collapse.type === 'item') {
          if (location.pathname === collapse.url) {
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  const fetchData = async () => {
    const response = await instance.get('/business', {
      params: {
        business_code: '',
        business_name: ''
      }
    });
    const businessMenu = response.data;

    //배열 만들기
    /*
                  id: item.business_id,
                  title: item.business_name, 
                  icon: ShoppingOutlined,
                  type: 'item',
                  url: `/purchase/${item.business_id}`,
                  breadcrumbs: false
    */
    const menuArray = businessMenu.map((item) => {
      return {
        id: item.business_id,
        title: item.business_name + ' 매입관리',
        icon: ShoppingOutlined,
        type: 'item',
        url: `/purchase/${item.business_id}`
      };
    });
    setMenuItems(menuArray);
  };

  useEffect(() => {
    if (menuItems.length === 0) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    navigation?.items?.map((menu) => {
      if (menu.id === 'purchase') {
        menu.children[0].children = menuItems;
      }
    });

    navigation?.items?.map((menu) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu);
      }
      return false;
    });
  });

  // only used for component demo breadcrumbs
  if (location.pathname === '/breadcrumbs') {
    location.pathname = '/dashboard/analytics';
  }

  let breadcrumbContent = <Typography />;

  // items
  if (item && item.type === 'item') {
    // main

    if (item.breadcrumbs !== false && location.pathname !== '/dashboard') {
      breadcrumbContent = (
        <MainCard border={false} sx={{ mb: 2, bgcolor: 'transparent' }} {...others} content={false}>
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item></Grid>
            {title && (
              <Grid item sx={{ mt: 2 }}>
                <Typography variant="h4">{item.title}</Typography>
              </Grid>
            )}
          </Grid>
        </MainCard>
      );
    }
  }

  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  navigation: PropTypes.object,
  title: PropTypes.bool
};

export default Breadcrumbs;
