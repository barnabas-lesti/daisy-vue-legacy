import router from '../core/plugins/router';
import widgetRepo from '../core/plugins/widget-repo';
import icons from '../core/theme/icons';

import DiaryItem from './models/diary-item';

import HealthTrendWidget from './widgets/HealthTrendWidget.vue';
import NutrientSummaryWidget from './widgets/NutrientSummaryWidget.vue';

import './plugins/store';

router.addSidebarItems([
  {
    labelKey: 'health.title',
    icon: icons.mdiCardsHeart,
    routeName: 'health',
    items: [
      {
        labelKey: 'health.views.diary.title',
        icon: icons.mdiCalendar,
        routeName: 'health.diary',
      },
      {
        labelKey: 'health.views.diet.title',
        icon: icons.mdiFoodApple,
        routeName: 'health.diet',
      },
    ],
  },
]);

router.addRoutes([
  {
    path: '/health',
    name: 'health',
    redirect: { name: 'health.dashboard' },
  },

  {
    path: '/health/diary',
    name: 'health.diary',
    titleKey: 'health.views.diary.title',
    redirect: { name: 'health.diary.date', params: { dateString: DiaryItem.today() } },
  },
  {
    path: '/health/diary/:dateString',
    name: 'health.diary.date',
    titleKey: 'health.views.diary.title',
    component: () => import(/* webpackChunkName: "health.views.diary" */ './views/Diary.vue'),
  },

  {
    path: '/health/food-and-recipes',
    name: 'health.diet',
    titleKey: 'health.views.diet.title',
    component: () => import(/* webpackChunkName: "health.views.diet" */ './views/Diet.vue'),
  },
]);

widgetRepo.addWidgets([
  {
    group: 'health.widgets.dashboardTitle',
    id: 'health/dashboard/nutrientSummaryWidget',
    Component: NutrientSummaryWidget,
  },
  {
    group: 'health.widgets.dashboardTitle',
    id: 'health/widgets/healthTrendWidget',
    Component: HealthTrendWidget,
  },
]);
