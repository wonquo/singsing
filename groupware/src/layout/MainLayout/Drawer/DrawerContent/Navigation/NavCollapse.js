import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
//import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
//<ShoppingOutlined /> import
//import { ShoppingOutlined } from '@ant-design/icons';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from './NavItem';
import { ListItemIcon } from '@mui/material';

// assets
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

//businessStore import

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
  };

  const iconSelectedColor = 'primary.main'; //eslint-disable-line

  const Icon = menu.icon;
  const itemIcon = menu.icon ? <Icon style={{ fontSize: '1.25rem' }} /> : false;

  const { pathname } = useLocation();
  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false);
    setSelected(null);
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (item.url === pathname) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);

  // menu collapse & item
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <ListItemButton
        disableRipple
        sx={{
          borderRadius: 1.5,
          mb: 0.5,
          alignItems: 'center',
          backgroundColor: 'inherit', //마우스 오버시 배경색 변경 없애기
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 28}px`
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        {' '}
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: selected === menu.id ? iconSelectedColor : 'text.primary'
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={
            <Typography variant={selected === menu.id ? 'h6' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? (
          <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        ) : (
          <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1
            }
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
};

export default NavCollapse;
