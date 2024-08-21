// assets
import { SettingOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';

// icons
const icons = {
  SettingOutlined,
  UserOutlined,
  HomeOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const system = {
  id: 'group-system',
  title: '',
  type: 'group',
  children: [
    {
      id: 'system',
      title: 'SYSTEM',
      type: 'collapse',
      url: '/system',
      icon: icons.SettingOutlined,
      children: [
        {
          id: 'system-user',
          title: '사용자 관리',
          type: 'item',
          url: '/user',
          icon: icons.UserOutlined
        },
        {
          id: 'system-business',
          title: '사업자 관리',
          type: 'item',
          url: '/business',
          icon: icons.HomeOutlined
        },
        //공통코드 관리
        {
          id: 'system-common-code',
          title: '공통코드 관리',
          type: 'item',
          url: '/common-code',
          icon: icons.HomeOutlined
        }
      ]
    }
  ]
};

export default system;
