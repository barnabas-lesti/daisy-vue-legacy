import Notification from '../../../models/notification';

export default {
  'common/asyncRegistry/push' (state, item) {
    state.common.asyncRegistry.push(item);
  },
  'common/asyncRegistry/remove' (state, item) {
    state.common.asyncRegistry = [...state.common.asyncRegistry.filter(entry => entry !== item)];
  },

  'common/titleKey/set' (state, titleKey) {
    state.common.titleKey = titleKey;
  },

  'common/sidebarItems/push' (state, newItems) {
    state.common.sidebarItems.push(...newItems);
  },

  'common/notifications/push' (state, notification) {
    state.common.notifications.push(new Notification(notification));
  },
  'common/notifications/remove' (state, { id }) {
    state.common.notifications = [...state.common.notifications.filter(item => item.id !== id)];
  },
};
