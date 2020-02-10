export default {
  config: {
    BASE_URL: process.env.BASE_URL,
    ...window.appConfig,
  },

  sidebarItems: [],

  preferences: {
    isDarkTheme: false,
  },

  user: null,
};
