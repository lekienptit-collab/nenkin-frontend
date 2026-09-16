export default [
  {
    path: '/auth',
    layout: false,
    routes: [
      { name: 'login', path: '/auth/login', component: './auth/Login' },
      { component: './404' },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/users',
    name: 'user',
    icon: 'team',
    access: 'menuUser',
    routes: [
      {
        path: '/users',
        redirect: '/users/list',
      },
      {
        path: '/users/list',
        name: 'users',
        icon: 'user',
        access: 'listUser',
        component: './users',
      },
      {
        path: '/users/role',
        name: 'role',
        icon: 'safety',
        access: 'listRole',
        component: './roles',
      },
      {
        path: '/users/role/permissions',
        name: 'permissionAssign',
        access: 'updateRolePermissions',
        hideInMenu: true,
        component: './roles/PermissionAssign',
      },
      { component: './404' },
    ],
  },
  {
    hideInMenu: true,
    name: 'account',
    icon: 'user',
    path: '/profile',
    component: './account',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
