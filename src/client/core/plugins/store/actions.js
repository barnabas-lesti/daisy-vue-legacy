export default {
  signInUser (context, user) {
    context.commit('setUser', user);
  },
  signOutUser (context) {
    context.commit('setUser', null);
  },
};
