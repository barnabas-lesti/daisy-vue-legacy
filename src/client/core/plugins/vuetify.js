import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

import 'typeface-roboto/index.css';
import '@fortawesome/fontawesome-free/css/all.css';

import store from '../store';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
    themes: {
      light: {
        // primary: colors.lightBlue.darken4,
        // secondary: '#b0bec5',
        // accent: '#8c9eff',
        // error: '#b71c1c',
      },
      dark: {},
    },
    dark: store.state.core.theme.isDark,
  },
});
