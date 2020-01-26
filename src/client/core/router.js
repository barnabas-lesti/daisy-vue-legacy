import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';

Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: store.state.core.config.BASE_URL,
  routes,
});

export default router;
