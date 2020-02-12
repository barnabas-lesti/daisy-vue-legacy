import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import 'typeface-roboto/index.css';
import '@fortawesome/fontawesome-free/css/all.css';

import store from './store';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
    dark: store.state.core.preferences.isDarkTheme,
    themes: {
      light: {},
      dark: {},
    },
  },
});

export default vuetify;
