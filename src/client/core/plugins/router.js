import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import config from './config';

class Route {
  constructor ({ path, name, component, meta, beforeEnter }) {
    this.path = path;
    this.name = name;
    this.component = component;
    this.meta = meta || {};
    this.beforeEnter = beforeEnter;
  }
}

class Router extends VueRouter {
  constructor (...args) {
    super(...args);
    this._routes = [];
  }

  addSidebarItems (sidebarItems) {
    store.commit('core/pushSidebarItems', sidebarItems);
  }

  addRoutes (routes) {
    const wrappedRoutes = routes.map(route => new Route(route));
    this._routes.push(...wrappedRoutes);
    super.addRoutes(wrappedRoutes);
  }

  getRoutes () {
    return this._routes;
  }
}

Vue.use(VueRouter);
const router = new Router({
  mode: 'history',
  base: config.BASE_URL,
});

export default router;
