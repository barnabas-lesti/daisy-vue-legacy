import config from '../config';

export default {
  namespaced: true,
  state: {
    config,

    theme: {
      isDark: false,
    },

    sidebarItems: [],
  },

  mutations: {
    pushSidebarItems (state, sidebarItems) {
      state.sidebarItems.push(...sidebarItems);
    },
  },

  getters: {
    groupedSidebarItems (state) {
      const groupedSidebarItems = {};
      for (const item of state.sidebarItems) {
        const group = item.group;
        if (group !== undefined || group !== null) {
          if (!groupedSidebarItems[group]) groupedSidebarItems[group] = [];
          groupedSidebarItems[group].push(item);
        }
      }
      return groupedSidebarItems;
    },
  },
};
