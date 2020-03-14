import Vue from 'vue';

import plugins from './plugins';
import theme from './theme';

import App from './App.vue';

import './routes';

Vue.config.productionTip = false;

new Vue({
  ...plugins,
  ...theme,

  render: h => h(App),
}).$mount('#app');
