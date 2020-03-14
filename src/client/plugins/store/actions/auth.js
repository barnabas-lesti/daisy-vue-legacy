import http from '../../http';

export default {
  async 'auth/register' (context, user) {
    await http.put('/api/auth/register', user);
  },

  async 'auth/signIn/withCredentials' (context, { email, password }) {
    const { user, authHeader } = await http.post('/api/auth/sign-in', { email, password });
    context.commit('auth/user/set', user);
    context.commit('auth/authHeader/set', authHeader);
  },
  async 'auth/signIn/withAuthHeader' (context, authHeader) {
    context.commit('auth/authHeader/set', authHeader);
    const user = await http.get('/api/auth/profile');
    context.commit('auth/user/set', user);
  },
  'auth/signOut' (context) {
    context.commit('auth/user/set', null);
    context.commit('auth/authHeader/set', null);
  },

  async 'auth/password/update' (context, { password, newPassword }) {
    await http.patch('/api/auth/profile/password', { password, newPassword });
  },
  async 'auth/profile/update' (context, update) {
    const updatedUser = await http.patch('/api/auth/profile', update);
    context.commit('auth/user/set', updatedUser);
  },
};
