import { router } from '../core';

router.registerRoute({
  path: '/preferences',
  name: 'preferences',
  component: () => import(/* webpackChunkName: "preferences" */ './PreferencesView.vue'),
});

router.registerSidebarItem({
  labelKey: 'preferences.title',
  icon: 'fas fa-cog',
  routeToName: 'preferences',
  group: 1,
  subItems: [
    {
      label: 'Lorem ipsum',
      icon: 'fas fa-cog',
      routeToName: 'preferences',
    },
  ],
});
