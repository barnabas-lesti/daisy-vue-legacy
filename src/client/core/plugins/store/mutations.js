import storage from '../storage';
import eventBus from '../event-bus';

import { User } from '../../models';

export default {
  pushSidebarItems ({ sidebarItems }, newItems) {
    sidebarItems.push(...newItems);
  },

  setUser (state, user) {
    state.user = user ? new User(user) : null;
  },
  setAuthHeader (state, authHeader) {
    state.authHeader = authHeader;
    eventBus.$emit('core/authHeaderSet', authHeader);
    storage.saveToLocalStorage('core.authHeader', authHeader);
  },
};
