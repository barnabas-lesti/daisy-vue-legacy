import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import { Route, SidebarItem } from '../models';

class Router extends VueRouter {
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
      .catch(() => {}); // To remove the console warning for navigation duplications
  }

  clearQuery (queryName) {
    this.pushQuery({ [queryName]: undefined });
  }
}

Vue.use(VueRouter);
const router = new Router({
  mode: 'history',
});

export default router;
