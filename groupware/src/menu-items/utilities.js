// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'Shadow',
      type: 'item',
      url: '/shadow',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'ant-icons',
      title: 'Ant Icons',
      type: 'item',
      url: '/icons/ant',
      icon: icons.AntDesignOutlined,
      breadcrumbs: false //breadcrumbs 는 무엇인가? => https://ant.design/components/breadcrumb/
    },
    {
      id: 'util-other',
      title: 'Other',
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'util-other-menu-1',
          title: 'Menu Item 1',
          type: 'item',
          url: '/#',
          breadcrumbs: false
        },
        {
          id: 'util-other-menu-2',
          title: 'Menu Item 2',
          type: 'item',
          url: '/#',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default utilities;
