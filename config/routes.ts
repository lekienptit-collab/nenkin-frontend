export default [
  {
    path: '/auth',
    layout: false,
    routes: [
      { name: 'login', path: '/auth/login', component: './auth/Login' },
      { component: './404' },
    ],
  },

  // --- Tong quan ---
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'dashboard',
    component: './Welcome',
  },

  // --- Người lao động ---
  {
    path: '/workers',
    name: 'worker',
    icon: 'idcard',
    access: 'listWorker',
    component: './workers',
  },
  {
    path: '/workers/create',
    name: 'workerCreate',
    access: 'createWorker',
    hideInMenu: true,
    component: './workers/Form',
  },
  {
    path: '/workers/:id/edit',
    name: 'workerEdit',
    access: 'updateWorker',
    hideInMenu: true,
    component: './workers/Form',
  },
  {
    path: '/workers/:id',
    name: 'workerDetail',
    access: 'listWorker',
    hideInMenu: true,
    component: './workers/Detail',
  },

  // --- Người đại diện ---
  {
    path: '/agents',
    name: 'agent',
    icon: 'solution',
    access: 'listAgent',
    component: './agents',
  },
  {
    path: '/agents/create',
    name: 'agentCreate',
    access: 'createAgent',
    hideInMenu: true,
    component: './agents/Form',
  },
  {
    path: '/agents/:id/edit',
    name: 'agentEdit',
    access: 'updateAgent',
    hideInMenu: true,
    component: './agents/Form',
  },
  {
    path: '/agents/:id',
    name: 'agentDetail',
    access: 'listAgent',
    hideInMenu: true,
    component: './agents/Detail',
  },

  // --- Thủ tục Nenkin ---
  {
    path: '/nenkin',
    name: 'nenkin',
    icon: 'fileProtect',
    access: 'listNenkinService',
    component: './nenkin',
  },
  {
    path: '/nenkin/request/:serviceType',
    name: 'nenkinRequest',
    access: 'createNenkinService',
    hideInMenu: true,
    component: './nenkin/Request',
  },

  // --- Thành viên & phân quyền ---
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
    redirect: '/workers',
  },
  {
    component: './404',
  },
];
