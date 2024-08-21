// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  ClusterOutlined,
  LoadingOutlined,
  //제품 관련 아이콘 추가
  FundOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  ClusterOutlined,
  FundOutlined,
  ShoppingCartOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const work = {
  id: 'work',
  title: '',
  type: 'group',
  children: [
    {
      id: 'sales management',
      title: '매출관리',
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        {
          id: 'vendor',
          title: '거래처 관리',
          type: 'item',
          url: '/vendor',
          icon: icons.ClusterOutlined
        },
        {
          id: 'product',
          title: '제품 관리',
          type: 'item',
          url: '/product',
          icon: icons.ShoppingCartOutlined
        },
        {
          id: 'sales-payment',
          title: '결제수단 관리',
          type: 'item',
          url: '/payment',
          icon: icons.BarcodeOutlined
        },
        {
          id: 'sales-monthly',
          title: '월매출 관리',
          type: 'item',
          url: '/sales-monthly',
          icon: icons.FundOutlined
        }
      ]
    }
  ]
};

export default work;
