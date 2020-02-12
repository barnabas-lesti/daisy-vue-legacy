import { router, store } from './plugins';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import(/* webpackChunkName: "preferences" */ './views/Preferences.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ './views/register/Register.vue'),
    isPublic: true,
  },
  {
    path: '/sign-in',
    name: 'signIn',
    component: () => import(/* webpackChunkName: "sign-in" */ './views/sign-in/SignIn.vue'),
    isPublic: true,
  },
  {
    path: '/sign-out',
    name: 'signOut',
    beforeEnter: () => store.dispatch('core/signOut'),
  },
];

router.addRoutes(routes);

router.beforeEach((to, from, next) => {
  const { name, fullPath } = to;
  const { user } = store.state.core;

  const currentRoute = routes.filter(route => route.name === name)[0];
  if (!user && !currentRoute.isPublic) {
    return next({ name: 'signIn', query: { referer: fullPath } });
  }

  if (user && currentRoute.isPublic) {
    return next({ name: 'home' });
  }

  return next();
});

// eventBus.$on('core/signedIn', () => router.push({ name: 'home' }));
// eventBus.$on('core/signedOut', () => router.push({ name: 'signIn' }));
