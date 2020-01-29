import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';

import eventService from '../services/event-service';

const { config } = store.state.core;

Vue.use(VueRouter);

class Router extends VueRouter {
  addSidebarItems (sidebarItems) {
    store.commit('core/pushSidebarItems', sidebarItems);
  }
}

const router = new Router({
  mode: 'history',
  base: config.BASE_URL,
});

// Route guard registrations
router.beforeEach((to, from, next) => {
  if (
    to.name !== 'signIn' &&
    !store.state.core.user
  ) return next({ name: 'signIn' });

  return next();
});

// State change listeners
eventService.$on('core/userSignedIn', () => router.push({ name: 'home' }));
eventService.$on('core/userSignedOut', () => router.push({ name: 'signIn' }));

// Route registrations
router.addRoutes([
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import(/* webpackChunkName: "preferences" */ '../views/PreferencesView.vue'),
  },
  {
    path: '/sign-in',
    name: 'signIn',
    component: () => import(/* webpackChunkName: "sign-in" */ '../views/SignInView.vue'),
  },
  {
    path: '/sign-out',
    name: 'signOut',
    beforeEnter: () => store.dispatch('core/signOutUser'),
  },
]);

// Sidebar navigation registrations
router.addSidebarItems([
  {
    labelKey: 'core.views.home.title',
    icon: 'fas fa-home',
    routeToName: 'home',
    group: 0,
  },
  {
    labelKey: 'core.views.preferences.title',
    icon: 'fas fa-cog',
    routeToName: 'preferences',
    group: 1,
  },
]);

export default router;
