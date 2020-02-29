import router from '../core/plugins/router';

import health from './views/health';
import diary from './views/diary';
import diet from './views/diet';

import './plugins/store';

router.addSidebarItems([
  ...health.sidebarItems,
]);

router.addRoutes([
  ...health.routes,
  ...diary.routes,
  ...diet.routes,
]);
