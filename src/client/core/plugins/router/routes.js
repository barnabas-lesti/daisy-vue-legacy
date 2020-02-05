export default (router, store) => {
  router.addRoutes([
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '../../views/HomeView.vue'),
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: () => import(/* webpackChunkName: "preferences" */ '../../views/PreferencesView.vue'),
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: () => import(/* webpackChunkName: "sign-in" */ '../../views/SignInView.vue'),
    },
    {
      path: '/sign-out',
      name: 'signOut',
      beforeEnter: () => store.dispatch('core/signOutUser'),
    },
  ]);
};
