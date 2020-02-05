import Vue from 'vue';

import router from './plugins/router';
import store from './plugins/store';
import i18n from './plugins/i18n';
import vuetify from './plugins/vuetify';

import App from './App.vue';

Vue.config.productionTip = false;

class Client {
  constructor () {
    this._vueApp = null;
  }

  start () {
    this._vueApp = new Vue({
      store,
      router,
      i18n,
      vuetify,
      render: h => h(App),
    }).$mount('#app');
  }
}

export const client = new Client();
