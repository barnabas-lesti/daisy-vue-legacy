import icons from '../../../core/theme/icons';

import diary from '../diary';
import diet from '../diet';

export default {
  routes: [
    {
      path: '/health',
      name: 'health',
      component: () => import(/* webpackChunkName: "health" */ './Health.vue'),
    },
  ],
  sidebarItems: [
    {
      labelKey: 'health.views.health.title',
      icon: icons.mdiCardsHeart,
      routeName: 'health',
      items: [
        ...diet.sidebarItems,
        ...diary.sidebarItems,
      ],
    },
  ],
};
