import Vue from 'vue';
import VueRouter from 'vue-router';

import config from './config';

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
  base: config.BASE_URL,
  routes,
});

export default router;
