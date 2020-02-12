import http from '../http';
import storage from '../storage';

import { User } from '../../models';

export default {
  pushSidebarItems ({ sidebarItems }, newItems) {
    sidebarItems.push(...newItems);
  },

  updatePreferences (state, update) {
    const updatedPreferences = { ...state.preferences, ...update };
    state.preferences = updatedPreferences;
    storage.saveToLocalStorage('core.preferences', updatedPreferences);
  },

  setUser (state, user) {
    state.user = user ? new User(user) : null;
  },
  setAuthHeader (state, authHeader) {
    if (authHeader) {
      state.authHeader = authHeader;
      http.setAuthHeader(authHeader);
      storage.saveToLocalStorage('core.authHeader', authHeader);
    } else {
      state.authHeader = null;
      http.clearAuthHeader();
      storage.removeFromLocalStorage('core.authHeader');
    }
  },
};
