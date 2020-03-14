import router from './plugins/router';
import store from './plugins/store';
import icons from './theme/icons';

import DiaryItem from './models/diary-item';

router.addSidebarItems([
  {
    labelKey: 'views.diary.title',
    icon: icons.mdiCalendar,
    routeName: 'diary',
  },
  {
    labelKey: 'views.diet.title',
    icon: icons.mdiFoodApple,
    routeName: 'diet',
  },
]);

router.addRoutes([
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    titleKey: 'views.dashboard.title',
    component: () => import(/* webpackChunkName: "views.dashboard" */ './views/Dashboard.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    titleKey: 'views.profile.title',
    component: () => import(/* webpackChunkName: "views.profile" */ './views/Profile.vue'),
  },
  {
    path: '/register',
    name: 'register',
    titleKey: 'views.register.title',
    component: () => import(/* webpackChunkName: "views.register" */ './views/Register.vue'),
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/sign-in',
    name: 'signIn',
    titleKey: 'views.signIn.title',
    component: () => import(/* webpackChunkName: "views.sign-in" */ './views/SignIn.vue'),
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/sign-out',
    name: 'signOut',
    beforeEnter: (to, from, next) => {
      store.dispatch('auth/signOut');
      next({ name: 'signIn' });
    },
  },

  {
    path: '/diary',
    name: 'diary',
    titleKey: 'views.diary.title',
    redirect: { name: 'diary.date', params: { dateString: DiaryItem.today() } },
  },
  {
    path: '/diary/:dateString',
    name: 'diary.date',
    titleKey: 'views.diary.title',
    component: () => import(/* webpackChunkName: "views.diary" */ './views/Diary.vue'),
  },

  {
    path: '/food-and-recipes',
    name: 'diet',
    titleKey: 'views.diet.title',
    component: () => import(/* webpackChunkName: "views.diet" */ './views/Diet.vue'),
  },

  {
    path: '*',
    name: 'notFound',
    redirect: { name: 'home' },
  },
]);

const authGuard = () => (to, from, next) => {
  const { name, fullPath } = to;
  const { user } = store.state.auth;

  const toRoute = router.getRoutes().filter(route => route.name === name)[0];
  if (!user && !toRoute.meta.isPublic) {
    next({ name: 'signIn', query: { referer: fullPath } });
    return;
  }

  if (user && toRoute.meta.isPublic) {
    next({ name: 'home' });
    return;
  }

  next();
};

const pageTitleGuard = () => async (to, from, next) => {
  const toRoute = router.getRoutes().filter(route => route.name === to.name)[0];
  await store.dispatch('common/titleKey/set', toRoute.titleKey);
  document.title = store.getters['common/title/tab'];
  next();
};

router.beforeEach(authGuard());
router.beforeEach(pageTitleGuard());
