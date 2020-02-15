import config from '../config';

export default {
  config: {
    ...config,
  },

  sidebarItems: [],
  breadcrumbs: [
    // {
    //   exact: true,
    //   text: 'Home',
    //   to: { name: 'home' },
    // },
    // {
    //   exact: true,
    //   text: 'Profile',
    //   to: { name: 'profile' },
    // },
  ],

  user: null,
  authHeader: null,
};
