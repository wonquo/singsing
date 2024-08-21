// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import axios from 'axios';
import { useAxiosStore } from 'store/cmnStore';
//ShoppingOutlined
import { ShoppingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const [menuItems, setMenuItems] = useState([]);

  const instance = axios.create({
    baseURL: useAxiosStore.getState().baseURL
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/business', {
          params: {
            business_code: '',
            business_name: ''
          }
        });
        const businessMenu = response.data;
        const updatedMenuItems = menuItem.items.map((item) => {
          if (item.id === 'purchase') {
            return {
              ...item,
              children: [
                {
                  ...item.children[0],
                  children: businessMenu.map((item2) => {
                    return {
                      id: item2.business_id,
                      title: item2.business_name,
                      icon: ShoppingOutlined,
                      type: 'item',
                      url: `/purchase/${item2.business_id}`,
                      breadcrumbs: false
                    };
                  })
                }
              ]
            };
          } else {
            return item;
          }
        });
        setMenuItems(updatedMenuItems);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  const navGroups = menuItems.map((item) => {
    switch (item.type) {
      case 'group':
        if (item.id === 'group-system') {
          return sessionStorage.getItem('auth') === 'admin' ? <NavGroup key={item.id} item={item} /> : null;
        } else {
          return <NavGroup key={item.id} item={item} />;
        }

      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
