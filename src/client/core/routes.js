import { router, store } from './plugins';

router.addRoutes([
  {
    path: '/',
    name: 'home',
    exact: true,
    component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ './views/register/Register.vue'),
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/sign-in',
    name: 'signIn',
    component: () => import(/* webpackChunkName: "sign-in" */ './views/sign-in/SignIn.vue'),
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/sign-out',
    name: 'signOut',
    beforeEnter: async () => {
      await store.dispatch('core/signOut');
      router.push({ name: 'signIn' });
    },
  },
  {
    path: '*',
    name: 'notFound',
    redirect: { name: 'home' },
  },
]);

const auth = () => (to, from, next) => {
  const { name, fullPath } = to;
  const { user } = store.state.core;

  const currentRoute = router.getRoutes().filter(route => route.name === name)[0];
  if (!user && !currentRoute.meta.isPublic) {
    return next({ name: 'signIn', query: { referer: fullPath } });
  }

  if (user && currentRoute.meta.isPublic) {
    return next({ name: 'home' });
  }

  return next();
};
router.beforeEach(auth());
