export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app

  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['超级管理员','库房列表','库房详情'],
    routes: [
      // dashboard
      { path: '/index', redirect: '/list/table-list' },
      {
        name: 'exception',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            hideInMenu: true,
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            hideInMenu: true,
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            hideInMenu: true,
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: '仓库管理',
        icon: 'credit-card',
        path: '/PublicStore',
        authority: ['超级管理员','库房列表'],
        component:'./PublicStore/PublicStore',
      },
      {
        name: '仓库列表',
        icon: 'credit-card',
        path: '/storeAll',
        // hideInMenu: true,
        authority: ['库房列表'],
        component:'./PublicStore/PublicStoreList',
      },
      {
        name: '库房详情',
        icon: 'container',
        path: '/storeDetail',
        authority: ['库房详情'],
        component:'./StoreDetail/StoreDetail',
      },
      // 库房详情列表
      {
        name: '出库管理',
        icon: 'layout',
        path: '/ExportStore',
        component: './ExportStore/ExportStoreList',
        authority: ['库房详情'],
      },
      {
        name: '入库管理',
        icon: 'layout',
        path: '/ImportStore',
        component: './ImportStore/ImportStoreList',
        authority: ['库房详情'],
      },
      // {
      //   name: '用户',
      //   icon: 'setting',
      //   path: '/account',
      //   hideInMenu: true,
      //   routes: [{
      //     name: '个人中心',
      //     path: '/account/center',
      //     component: './Account/Center/Center',
      //   }, {
      //     name: '个人设置',
      //     path: '/account/setting/base',
      //   }],
      // },
      {
        component: '404',
      },
    ],
  },
];
