import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import config from './config';

class Router extends VueRouter {
  addSidebarItems (sidebarItems) {
    store.commit('core/pushSidebarItems', sidebarItems);
  }
}

Vue.use(VueRouter);
const router = new Router({
  mode: 'history',
  base: config.BASE_URL,
});

export default router;
