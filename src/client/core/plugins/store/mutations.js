import storage from '../storage';
import eventBus from '../event-bus';

import User from '../../models/user';

export default {
  'asyncRegistry/push' (state, item) {
    state.asyncRegistry.push(item);
  },
  'asyncRegistry/remove' (state, item) {
    state.asyncRegistry = [...state.asyncRegistry.filter(entry => entry !== item)];
  },

  'pushSidebarItems' ({ sidebarItems }, newItems) {
    sidebarItems.push(...newItems);
  },

  'setUser' (state, user) {
    state.user = user ? new User(user) : null;
  },
  'setAuthHeader' (state, authHeader) {
    state.authHeader = authHeader;
    eventBus.$emit('core/authHeaderSet', authHeader);
    storage.saveToLocalStorage('core/authHeader', authHeader);
  },

  'pushNotification' (state, notification) {
    state.notifications.push(notification);
  },
  'removeNotification' (state, { id }) {
    state.notifications = state.notifications.filter(item => item.id !== id);
  },
};
