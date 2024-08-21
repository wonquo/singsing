// assets
import { AppstoreAddOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  ProfileOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const expense = {
  id: 'expense',
  title: '',
  type: 'group',
  children: [
    {
      id: 'expense management',
      title: '경비관리',
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'expense',
          title: '경비관리',
          type: 'item',
          url: '/expense',
          icon: icons.ProfileOutlined
        }
      ]
    }
  ]
};

export default expense;
