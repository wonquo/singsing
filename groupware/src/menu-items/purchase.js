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
const purchase = {
  id: 'purchase',
  title: '',
  type: 'group',
  children: [
    {
      id: 'purchase-management',
      title: '매입관리',
      type: 'collapse',
      icon: icons.AppstoreAddOutlined,
      children: [
        //here
      ]
    }
  ]
};

export default purchase;
