import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';

import eventListeners from './event-listeners';
import guards from './guards';
import routes from './routes';
import sidebarItems from './sidebar-items';

class Router extends VueRouter {
  addSidebarItems (sidebarItems) {
    store.commit('core/pushSidebarItems', sidebarItems);
  }
}

Vue.use(VueRouter);
const router = new Router({
  mode: 'history',
  base: store.state.core.config.BASE_URL,
});

guards(router, store);
eventListeners(router);
routes(router, store);
sidebarItems(router);

export default router;
