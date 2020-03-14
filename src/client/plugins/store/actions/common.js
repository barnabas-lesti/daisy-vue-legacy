import utils from '../../utils';

import Notification from '../../../models/notification';

export default {
  async 'common/asyncRegistry/create' (context) {
    const id = utils.createUUID();
    context.commit('common/asyncRegistry/push', id);
    return id;
  },
  'common/asyncRegistry/remove' (context, item) {
    context.commit('common/asyncRegistry/remove', item);
  },

  'common/titleKey/set' (context, titleKey) {
    context.commit('common/titleKey/set', titleKey);
  },

  async 'common/notify' (context, payload) {
    const notification = { id: utils.createUUID(), ...getNotificationFromPayload(payload) };
    context.commit('common/notifications/push', notification);
    return new Promise(resolve => {
      window.setTimeout(() => {
        context.commit('common/notifications/remove', notification);
        resolve();
      }, 3000);
    });
  },
  async 'common/notify/success' (context, payload) {
    return context.dispatch('common/notify', { type: Notification.types.SUCCESS, ...getNotificationFromPayload(payload) });
  },
  async 'common/notify/info' (context, payload) {
    return context.dispatch('common/notify', { type: Notification.types.INFO, ...getNotificationFromPayload(payload) });
  },
  async 'common/notify/warning' (context, payload) {
    return context.dispatch('common/notify', { type: Notification.types.WARNING, ...getNotificationFromPayload(payload) });
  },
  async 'common/notify/error' (context, payload) {
    return context.dispatch('common/notify', { type: Notification.types.ERROR, ...getNotificationFromPayload(payload) });
  },
};

function getNotificationFromPayload (payload) {
  return typeof payload === 'object' ? payload : { text: payload };
}
