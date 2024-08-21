import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const User = Loadable(lazy(() => import('pages/system/User')));
const Business = Loadable(lazy(() => import('pages/system/Business')));
const Vendor = Loadable(lazy(() => import('pages/work/Vendor')));
const Product = Loadable(lazy(() => import('pages/work/Product')));
const Payment = Loadable(lazy(() => import('pages/work/Payment')));
const Sales = Loadable(lazy(() => import('pages/work/Sales')));
const Expense = Loadable(lazy(() => import('pages/work/Expense')));
const CommonCode = Loadable(lazy(() => import('pages/system/CommonCode')));
const Purchase = Loadable(lazy(() => import('pages/purchase/Purchase')));
const Todo = Loadable(lazy(() => import('pages/place/Todo')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <User />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    },
    //system/user
    {
      path: 'user',
      element: <User />
    },
    //system/business
    {
      path: 'business',
      element: <Business />
    },
    //work/product
    {
      path: 'product',
      element: <Product />
    },
    {
      path: 'vendor',
      element: <Vendor />
    },
    {
      path: 'payment',
      element: <Payment />
    },
    {
      path: 'sales-monthly',
      element: <Sales />
    },
    {
      path: 'expense',
      element: <Expense />
    },
    {
      path: 'common-code',
      element: <CommonCode />
    },
    {
      path: 'purchase/:businessId',
      element: <Purchase />
    }
    ,
    {
      path: 'todo',
      element: <Todo />
    }
  ]
};

export default MainRoutes;
