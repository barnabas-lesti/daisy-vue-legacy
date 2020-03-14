import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

class Store extends Vuex.Store {
  constructor (...args) {
    super(...args);

    this.mapActions = Vuex.mapActions;
    this.mapGetters = Vuex.mapGetters;
    this.mapMutations = Vuex.mapMutations;
    this.mapState = Vuex.mapState;
  }
}

export default new Store({
  state,
  mutations,
  actions,
  getters,
});
