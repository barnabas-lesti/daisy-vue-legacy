import storage from '../../storage';
import eventBus from '../../event-bus';
import User from '../../../models/user';

export default {
  'auth/user/set' (state, user) {
    state.auth.user = user ? new User(user) : null;
  },
  'auth/authHeader/set' (state, authHeader) {
    state.auth.authHeader = authHeader;
    eventBus.$emit('auth/authHeader/set', authHeader);
    if (authHeader) {
      storage.saveToLocalStorage('auth/authHeader', authHeader);
    } else {
      storage.removeFromLocalStorage('auth/authHeader');
    }
  },
};
