import config from '../../config';

export default {
  config: {
    BASE_URL: process.env.BASE_URL,
    ...config,
  },

  sidebarItems: [],

  user: null,
  authHeader: null,

  // TODO: merge with user
  preferences: {
    isDarkTheme: false,
  },
};
