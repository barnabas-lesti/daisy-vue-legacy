import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import 'typeface-roboto/index.css';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
    themes: {
      light: {},
      dark: {},
    },
  },
});

export default vuetify;
