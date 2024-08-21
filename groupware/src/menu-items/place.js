// assets - todo icon
import { AppstoreAddOutlined, FileTextOutlined} from '@ant-design/icons';

// icons
const icons = {
    AppstoreAddOutlined,
    FileTextOutlined
};

// ==============================|| MENU ITEMS -  place ||============================== //

const place = {
    id: 'place',
    title: '',
    type: 'group',
    children: [
      {
        id: 'place management',
        title: '업무관리',
        type: 'collapse',
        icon: icons.AppstoreAddOutlined,
        children: [
          {
            id: 'todo',
            title: 'To-Do',
            type: 'item',
            url: '/todo',
            icon: icons.FileTextOutlined
          }
        ]
      }
    ]
  };
  

export default place;
