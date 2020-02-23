import { store, storage } from '../../../core/plugins';

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

const calculatorItemSkeletons = storage.getFromLocalStorage('health/calculator/itemSkeletons');
if (calculatorItemSkeletons) store.commit('health/calculator/setItemSkeletons', calculatorItemSkeletons);
