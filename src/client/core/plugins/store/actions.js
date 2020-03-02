import http from '../http';

import Notification from '../../models/notification';

export default {
  async 'asyncRegistry/create' (context) {
    const id = createUUIDv4();
    context.commit('asyncRegistry/push', id);
    return id;
  },
  'asyncRegistry/remove' (context, item) {
    context.commit('asyncRegistry/remove', item);
  },

  'setTitleKey' (context, titleKey) {
    context.commit('setTitleKey', titleKey);
  },

  async register (context, user) {
    await http.put('/api/auth/register', user);
  },

  async signInWithCredentials (context, { email, password }) {
    const { user, authHeader } = await http.post('/api/auth/sign-in', { email, password });
    context.commit('setUser', user);
    context.commit('setAuthHeader', authHeader);
  },
  async signInWithAuthHeader (context, authHeader) {
    context.commit('setAuthHeader', authHeader);
    const user = await http.get('/api/auth/profile');
    context.commit('setUser', user);
  },
  signOut (context) {
    context.commit('setUser', null);
    context.commit('setAuthHeader', null);
  },

  async updatePassword (context, { password, newPassword }) {
    await http.patch('/api/auth/profile/password', { password, newPassword });
  },
  async updateProfile (context, update) {
    const updatedUser = await http.patch('/api/auth/profile', update);
    context.commit('setUser', updatedUser);
  },

  async 'notify' (context, payload) {
    const notification = { id: Notification.createId(), ...getNotificationFromPayload(payload) };
    context.commit('notifications/push', notification);
    return new Promise(resolve => {
      window.setTimeout(() => {
        context.commit('notifications/remove', notification);
        resolve();
      }, 3000);
    });
  },
  async 'notify/success' (context, payload) {
    return context.dispatch('notify', { type: Notification.types.SUCCESS, ...getNotificationFromPayload(payload) });
  },
  async 'notify/info' (context, payload) {
    return context.dispatch('notify', { type: Notification.types.INFO, ...getNotificationFromPayload(payload) });
  },
  async 'notify/warning' (context, payload) {
    return context.dispatch('notify', { type: Notification.types.WARNING, ...getNotificationFromPayload(payload) });
  },
  async 'notify/error' (context, payload) {
    return context.dispatch('notify', { type: Notification.types.ERROR, ...getNotificationFromPayload(payload) });
  },
};

function getNotificationFromPayload (payload) {
  return typeof payload === 'object' ? payload : { text: payload };
}

function createUUIDv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
