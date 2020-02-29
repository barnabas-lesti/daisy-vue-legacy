import http from '../http';

import Notification from '../../models/notification';

export default {
  'loading' (context, value) {
    context.commit('setLoading', value);
  },

  async register (context, user) {
    context.dispatch('loading', true);
    await http.put('/api/auth/register', user);
    context.dispatch('loading', false);
  },

  async signInWithCredentials (context, { email, password }) {
    context.dispatch('loading', true);
    const { user, authHeader } = await http.post('/api/auth/sign-in', { email, password });
    context.commit('setUser', user);
    context.commit('setAuthHeader', authHeader);
    context.dispatch('loading', false);
  },
  async signInWithAuthHeader (context, authHeader) {
    context.dispatch('loading', true);
    context.commit('setAuthHeader', authHeader);
    const user = await http.get('/api/auth/profile');
    context.commit('setUser', user);
    context.dispatch('loading', false);
  },
  signOut (context) {
    context.commit('setUser', null);
    context.commit('setAuthHeader', null);
  },

  async updatePassword (context, { password, newPassword }) {
    context.dispatch('loading', true);
    await http.patch('/api/auth/profile/password', { password, newPassword });
    context.dispatch('loading', false);
  },
  async updateProfile (context, update) {
    context.dispatch('loading', true);
    const updatedUser = await http.patch('/api/auth/profile', update);
    context.commit('setUser', updatedUser);
    context.dispatch('loading', false);
  },

  async notify (context, payload) {
    const notification = new Notification(getNotificationFromPayload(payload));
    context.commit('pushNotification', notification);
    return new Promise(resolve => {
      window.setTimeout(() => {
        context.commit('removeNotification', notification);
        resolve();
      }, 3000);
    });
  },
  async 'notify/success' (context, payload) {
    return context.dispatch('notify', { type: 'success', ...getNotificationFromPayload(payload) });
  },
  async 'notify/info' (context, payload) {
    return context.dispatch('notify', { type: 'info', ...getNotificationFromPayload(payload) });
  },
  async 'notify/warning' (context, payload) {
    return context.dispatch('notify', { type: 'warning', ...getNotificationFromPayload(payload) });
  },
  async 'notify/error' (context, payload) {
    return context.dispatch('notify', { type: 'error', ...getNotificationFromPayload(payload) });
  },
};

function getNotificationFromPayload (payload) {
  return typeof payload === 'object' ? payload : { text: payload };
}
