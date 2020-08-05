import React from 'react';




const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));


const Typography = React.lazy(() => import('./views/theme/typography/Typography'));

const Group = React.lazy(()=>import('./views/itemManagement/group/groupView'))
const ControlledTabs = React.lazy(() => import('./views/itemManagement/Menu-Item'));

const ListGroupItem = React.lazy(()=>import('./views/itemManagement/group-itemMap/groupItemView'))
const TaskList = React.lazy(()=>import('./views/orderManagement/taskList'))
const Setting = React.lazy(()=>import('./views/Setting/setting'))





const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/group', name: 'Group', component: Group },
  { path: '/lists', name: 'List', component: ListGroupItem },
  { path: '/order', name: 'Tasks', component: TaskList },
  { path: '/setting', name: 'Setting', component: Setting },
 { path: '/item', name: 'Menu-Item', component: ControlledTabs},

  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme/typography', name: 'Typography', component: Typography },
];

export default routes;
