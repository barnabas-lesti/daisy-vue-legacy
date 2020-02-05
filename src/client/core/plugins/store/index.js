import Vue from 'vue';
import Vuex from 'vuex';

import storageService from '../../services/storage-service';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    core: {
      namespaced: true,
      state,
      mutations,
      actions,
      getters,
    },
  },
});

store.commit('core/updatePreferences', storageService.getFromLocalStorage('core.preferences'));
store.commit('core/setUser', storageService.getFromLocalStorage('core.user'));

export default store;
