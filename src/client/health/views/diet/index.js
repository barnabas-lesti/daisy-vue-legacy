import store from '../../../core/plugins/store';
import icons from '../../../core/theme/icons';

export default {
  routes: [
    {
      path: '/health/diet',
      name: 'health.diet',
      component: () => import(/* webpackChunkName: "health.diet" */ './Diet.vue'),
      beforeEnter: async (to, from, next) => {
        await store.dispatch('health/diet/ensureItems');
        next();
      },
    },
  ],
  sidebarItems: [
    {
      labelKey: 'health.views.diet.title',
      icon: icons.mdiFoodApple,
      routeName: 'health.diet',
    },
  ],
};
