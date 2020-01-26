import { router } from '../core';

router.registerRoute({
  path: '/home',
  name: 'home',
  component: () => import(/* webpackChunkName: "home" */ './HomeView.vue'),
});

router.registerSidebarItem({
  labelKey: 'home.title',
  icon: 'fas fa-home',
  routeToName: 'home',
  group: 0,
});
