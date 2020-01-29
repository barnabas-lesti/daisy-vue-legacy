import Vue from 'vue';
import Vuex from 'vuex';

import storageService from '../services/storage-service';
import eventService from '../services/event-service';

const PREFERENCES_STORAGE_KEY = 'preferences';
const USER_STORAGE_KEY = 'user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    core: {
      namespaced: true,
      state: {
        config: {
          BASE_URL: process.env.BASE_URL,
          ...window.publicEnvConfig,
        },

        sidebarItems: [],

        preferences: storageService.getFromLocalStorage(PREFERENCES_STORAGE_KEY) || {
          isDarkTheme: false,
        },

        user: storageService.getFromLocalStorage(USER_STORAGE_KEY) || null,
      },

      mutations: {
        pushSidebarItems ({ sidebarItems }, newItems) {
          sidebarItems.push(...newItems);
        },

        updatePreferences (state, update) {
          const updatedPreferences = { ...state.preferences, ...update };
          state.preferences = updatedPreferences;
          storageService.saveToLocalStorage(PREFERENCES_STORAGE_KEY, updatedPreferences);
          eventService.$emit('core/preferencesUpdated', updatedPreferences);
        },

        setUser (state, user) {
          state.user = user;
          storageService.saveToLocalStorage(USER_STORAGE_KEY, user);
          eventService.$emit(`core/${user ? 'userSignedIn' : 'userSignedOut'}`);
        },
      },

      actions: {
        signInUser (context, user) {
          context.commit('setUser', user);
        },
        signOutUser (context) {
          context.commit('setUser', null);
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
    },
  },

});
