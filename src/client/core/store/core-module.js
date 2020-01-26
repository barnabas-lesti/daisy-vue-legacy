import config from '../config';
import storage from '../storage';
import eventBus from '../event-bus';

const PREFERENCES_STORAGE_KEY = 'preferences';

export default {
  namespaced: true,
  state: {
    config,

    sidebarItems: [],

    preferences: storage.getFromLocalStorage(PREFERENCES_STORAGE_KEY) || {
      isDarkTheme: false,
    },
  },

  mutations: {
    pushSidebarItems ({ sidebarItems }, newItems) {
      sidebarItems.push(...newItems);
    },
    updatePreferences (store, update) {
      const updatedPreferences = { ...store.preferences, ...update };
      store.preferences = updatedPreferences;
      storage.saveToLocalStorage(PREFERENCES_STORAGE_KEY, updatedPreferences);
      eventBus.$emit('core/preferencesUpdated', updatedPreferences);
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
