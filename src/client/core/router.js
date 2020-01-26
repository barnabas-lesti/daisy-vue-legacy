import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';

const { config } = store.state.core;

Vue.use(VueRouter);

class Router {
  constructor () {
    this._vueRouter = new VueRouter({
      mode: 'history',
      base: config.BASE_URL,
    });
  }

  registerRoute (route) {
    this.registerRoutes([ route ]);
  }

  registerRoutes (routes) {
    this._vueRouter.addRoutes(routes);
  }

  registerSidebarItem (sidebarItem) {
    this.registerSidebarItems([ sidebarItem ]);
  }

  registerSidebarItems (sidebarItems) {
    store.commit('core/pushSidebarItems', sidebarItems);
  }

  getVueRouter () {
    return this._vueRouter;
  }
}

export default new Router();
