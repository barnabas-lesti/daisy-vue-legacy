import router from './router';

router.registerRoute({
  path: '/preferences',
  name: 'preferences',
  component: () => import(/* webpackChunkName: "preferences" */ './views/PreferencesView.vue'),
});

router.registerSidebarItem({
  labelKey: 'core.preferences.title',
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
