import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import SidebarItem from '../models/sidebar-item';

class Route {
  constructor ({ exact, path, name, component, meta, beforeEnter, redirect }) {
    this.exact = exact;
    this.path = path;
    this.name = name;
    this.component = component;
    this.meta = meta || {};
    this.beforeEnter = beforeEnter;
    this.redirect = redirect;
  }
}

class Router extends VueRouter {
  static Route = Route;

  constructor (...args) {
    super(...args);

    this.Route = Route;
    this.SidebarItem = SidebarItem;

    this._routes = [];
  }

  /**
   * @param {SidebarItem[]} sidebarItems
   */
  addSidebarItems (sidebarItems) {
    store.commit('core/pushSidebarItems', sidebarItems.map(item => new SidebarItem(item)));
  }

  /**
   * @param {Route[]} routes
   */
  addRoutes (routes) {
    const wrappedRoutes = routes.map(route => new Route(route));
    this._routes.push(...wrappedRoutes);
    super.addRoutes(wrappedRoutes);
  }

  getRoutes () {
    return this._routes;
  }

  pushQuery (query) {
    this.push({ query: { ...this.currentRoute.query, ...query } })
      // To remove the console warning for navigation duplications
      .catch(() => {});
  }

  clearQuery (queryName) {
    this.pushQuery({ [queryName]: undefined });
  }

  backToReferer () {
    const referer = this.currentRoute.query['referer'];
    if (referer) {
      this.push(referer)
        // When reloading page, referer components are not created and error
        // is thrown, for now clearing the params
        .catch(() => this.clearQuery('referer'));
    }
  }
}

Vue.use(VueRouter);
const router = new Router({
  mode: 'history',
});

export default router;
