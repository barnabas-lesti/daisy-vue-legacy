import router from '../core/plugins/router';
import icons from '../core/theme/icons';

import dashboard from './views/dashboard';
import diary from './views/diary';
import diet from './views/diet';

import './plugins/store';

router.addSidebarItems([
  {
    labelKey: 'health.sidebarTitle',
    icon: icons.mdiCardsHeart,
    routeName: 'health',
    items: [
      ...dashboard.sidebarItems,
      ...diet.sidebarItems,
      ...diary.sidebarItems,
    ],
  },
]);

router.addRoutes([
  {
    path: '/health',
    name: 'health',
    redirect: { name: 'health.dashboard' },
  },

  ...dashboard.routes,
  ...diary.routes,
  ...diet.routes,
]);
