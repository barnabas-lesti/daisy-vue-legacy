import Vue from 'vue';

import plugins from './plugins';
import theme from './theme';

import App from './App.vue';

import './routes';

Vue.config.productionTip = false;

class Client {
  constructor () {
    this._vueApp = null;
  }

  start () {
    this._vueApp = new Vue({
      ...plugins,
      ...theme,

      render: h => h(App),
    }).$mount('#app');
  }
}

export const client = new Client();
