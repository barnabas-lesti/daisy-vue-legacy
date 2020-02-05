export default (router, store) => {
  router.beforeEach((to, from, next) => {
    if (
      to.name !== 'signIn' &&
      !store.state.core.user
    ) return next({ name: 'signIn' });

    return next();
  });
};
