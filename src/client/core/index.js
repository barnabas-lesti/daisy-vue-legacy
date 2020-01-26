import Vue from 'vue';

import router from './router';
import store from './store';
import i18n from './i18n';
import storage from './storage';
import eventBus from './event-bus';

import vuetify from './plugins/vuetify';

import AppTemplate from './AppTemplate.vue';

import './routes';

class App {
  constructor () {
    Vue.config.productionTip = false;

    this._vueApp = new Vue({
      store,
      router: router.getVueRouter(),
      i18n: i18n.getVueI18n(),

      vuetify,

      render: h => h(AppTemplate),
    });
  }

  start () {
    this._vueApp.$mount('#app');
  }

  getVueApp () {
    return this._vueApp;
  }
}

const app = new App();

export {
  router,
  store,
  i18n,
  storage,
  eventBus,

  app,
};
