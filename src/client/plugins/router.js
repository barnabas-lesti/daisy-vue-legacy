import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';

class Route {
  constructor ({ path, name, titleKey, component, meta, beforeEnter, redirect }) {
    this.path = path;
    this.name = name;
    this.titleKey = titleKey;
    this.component = component;
    this.meta = meta || {};
    this.beforeEnter = beforeEnter;
    this.redirect = redirect;
  }
}

class SidebarItem {
  constructor ({ icon, items, label, labelKey, order, routeName }) {
    this.icon = icon;
    this.items = items;
    this.label = label;
    this.labelKey = labelKey;
    this.order = order || 0;
    this.routeName = routeName;
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
    store.commit('common/sidebarItems/push', sidebarItems.map(item => new SidebarItem(item)));
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
}

Vue.use(VueRouter);
const router = new Router({
  mode: 'history',
});

export default router;
