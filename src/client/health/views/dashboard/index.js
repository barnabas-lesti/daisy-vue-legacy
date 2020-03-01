import icons from '../../../core/theme/icons';

export default {
  routes: [
    {
      path: '/health/dashboard',
      name: 'health.dashboard',
      component: () => import(/* webpackChunkName: "health.dashboard" */ './Dashboard.vue'),
    },
  ],
  sidebarItems: [
    {
      labelKey: 'health.views.dashboard.sidebarTitle',
      icon: icons.mdiViewDashboardOutline,
      routeName: 'health.dashboard',
    },
  ],
};
