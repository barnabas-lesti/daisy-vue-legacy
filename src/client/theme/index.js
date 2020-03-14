import Vue from 'vue';

import colors from './colors';
import icons from './icons';
import vuetify from './vuetify';

Vue.prototype.$theme = Vue.prototype.$theme || {
  icons,
  colors,
};

export default {
  icons,
  vuetify,
  colors,
};
