export default class Route {
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
