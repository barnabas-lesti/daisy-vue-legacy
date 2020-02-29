import store from '../../../core/plugins/store';
import icons from '../../../core/theme/icons';

import DiaryItem from '../../models/diary-item';

export default {
  routes: [
    {
      path: '/health/diary',
      name: 'health.diary',
      redirect: { name: 'health.diary.date', params: { dateString: DiaryItem.today() } },
    },
    {
      path: '/health/diary/:dateString',
      name: 'health.diary.date',
      component: () => import(/* webpackChunkName: "health.diary" */ './Diary.vue'),
      beforeEnter: async (to, from, next) => {
        const { dateString } = to.params;
        if (DiaryItem.isDateStringValid(dateString)) {
          await Promise.all([
            store.dispatch('health/diet/ensureItems'),
            store.dispatch('health/diary/ensureItem', dateString),
          ]);
          next();
        } else {
          next({ name: 'health.diary' });
        }
      },
    },
  ],
  sidebarItems: [
    {
      labelKey: 'health.views.diary.title',
      icon: icons.mdiCalendar,
      routeName: 'health.diary',
    },
  ],
};
