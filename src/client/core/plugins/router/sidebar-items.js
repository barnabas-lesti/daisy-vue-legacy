export default (router) => {
  router.addSidebarItems([
    {
      labelKey: 'core.views.home.title',
      icon: 'fas fa-home',
      routeToName: 'home',
      group: 0,
    },
    {
      labelKey: 'core.views.preferences.title',
      icon: 'fas fa-cog',
      routeToName: 'preferences',
      group: 1,
    },
  ]);
};
