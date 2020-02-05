import storageService from '../../services/storage-service';
import eventService from '../../services/event-service';

export default {
  pushSidebarItems ({ sidebarItems }, newItems) {
    sidebarItems.push(...newItems);
  },

  updatePreferences (state, update) {
    const updatedPreferences = { ...state.preferences, ...update };
    state.preferences = updatedPreferences;
    storageService.saveToLocalStorage('core.preferences', updatedPreferences);
    eventService.$emit('core/preferencesUpdated', updatedPreferences);
  },

  setUser (state, user) {
    state.user = user;
    storageService.saveToLocalStorage('core.user', user);
    eventService.$emit(user ? 'core/userSignedIn' : 'core/userSignedOut');
  },
};
