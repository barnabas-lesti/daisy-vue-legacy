import router from './plugins/router';
import store from './plugins/store';

router.addRoutes([
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    titleKey: 'core.views.dashboard.title',
    component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    titleKey: 'core.views.profile.title',
    component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue'),
  },
  {
    path: '/register',
    name: 'register',
    titleKey: 'core.views.register.title',
    component: () => import(/* webpackChunkName: "register" */ './views/register/Register.vue'),
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/sign-in',
    name: 'signIn',
    titleKey: 'core.views.signIn.title',
    component: () => import(/* webpackChunkName: "sign-in" */ './views/sign-in/SignIn.vue'),
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/sign-out',
    name: 'signOut',
    beforeEnter: (to, from, next) => {
      store.dispatch('core/signOut');
      next({ name: 'signIn' });
    },
  },
  {
    path: '*',
    name: 'notFound',
    redirect: { name: 'home' },
  },
]);

const authGuard = () => (to, from, next) => {
  const { name, fullPath } = to;
  const { user } = store.state.core;

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
  await store.dispatch('core/setTitleKey', toRoute.titleKey);
  document.title = store.getters['core/title/tab'];
  next();
};

router.beforeEach(authGuard());
router.beforeEach(pageTitleGuard());
