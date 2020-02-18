import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import 'typeface-roboto/index.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    // https://materialdesignicons.com/
    iconfont: 'mdiSvg',
  },
  theme: {
    themes: {
      light: {},
      dark: {},
    },
  },
});

export default vuetify;
