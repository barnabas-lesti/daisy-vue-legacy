import store from '../../../core/plugins/store';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

store.registerModule('health', {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
});
