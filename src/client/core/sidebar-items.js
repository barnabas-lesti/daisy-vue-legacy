import { router } from './plugins';

router.addSidebarItems([
  {
    labelKey: 'core.views.home.title',
    icon: 'fas fa-home',
    routeToName: 'home',
    group: 0,
  },
  {
    labelKey: 'core.views.profile.title',
    icon: 'fas fa-cog',
    routeToName: 'profile',
    group: 1,
  },
]);
