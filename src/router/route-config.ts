import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/demo',
    name: 'Demo',
    component: () =>
      import(/* webpackChunkName: "detail" */ '../views/example/demo.vue'),
    meta: {
      keepAlive: false,
      independent: true,
    },
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () =>
      import(/* webpackChunkName: "detail" */ '../views/example/detail.vue'),
    meta: {
      keepAlive: false,
      independent: true,
    },
  },
  {
    path: '/home',
    name: 'ExampleHome',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/example/home.vue'),
    meta: {
      keepAlive: true,
      independent: true,
    },
  },
  {
    path: '/refuse-page',
    name: 'RefusePage',
    component: () =>
      import(
        /* webpackChunkName: "refuse-page" */ '../views/refuse-page/index'
      ),
    meta: {
      keepAlive: false,
      independent: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    component: () =>
      import(
        /* webpackChunkName: "not-found-page" */ '../views/not-found-page/index'
      ),
  },
]
