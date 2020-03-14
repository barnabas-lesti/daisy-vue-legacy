import config from '../config';

export default {
  common: {
    config,
    asyncRegistry: [],
    titleKey: '',
    sidebarItems: [],
    notifications: [],
  },
  auth: {
    user: null,
    authHeader: null,
  },

  diet: {
    foods: null,
    recipes: null,
  },

  diary: {
    items: [],
  },
};
