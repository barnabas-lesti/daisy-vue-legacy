import http from '../http';

export default {
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
};
