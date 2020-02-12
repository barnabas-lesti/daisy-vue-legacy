import Vue from 'vue';

import plugins from './plugins';
import App from './App.vue';

import './routes';
import './sidebar-items';

Vue.config.productionTip = false;

class Client {
  constructor () {
    this._vueApp = null;
  }

  start () {
    this._vueApp = new Vue({
      ...plugins,
      render: h => h(App),
    }).$mount('#app');
  }
}

export const client = new Client();
