import { router } from '../core/plugins';
import icons from '../core/theme/icons';

router.addSidebarItems([
  {
    labelKey: 'health.views.health.title',
    icon: icons.mdiCardsHeart,
    routeName: 'health',
    items: [
      {
        labelKey: 'health.views.calculator.title',
        icon: icons.mdiCalculator,
        routeName: 'health.calculator',
      },
      {
        labelKey: 'health.views.diet.title',
        icon: icons.mdiFoodApple,
        routeName: 'health.diet',
      },
      {
        labelKey: 'health.views.exercise.title',
        icon: icons.mdiWeightLifter,
        routeName: 'health.exercise',
      },
    ],
  },
]);

router.addRoutes([
  {
    path: '/health',
    name: 'health',
    component: () => import(/* webpackChunkName: "health" */ './views/Health.vue'),
  },

  {
    path: '/health/calculator',
    name: 'health.calculator',
    component: () => import(/* webpackChunkName: "health.calculator" */ './views/Calculator.vue'),
  },
  {
    path: '/health/diet',
    name: 'health.diet',
    component: () => import(/* webpackChunkName: "health.diet" */ './views/diet/Diet.vue'),
  },
  {
    path: '/health/exercise',
    name: 'health.exercise',
    component: () => import(/* webpackChunkName: "health.exercise" */ './views/Exercise.vue'),
  },
]);
