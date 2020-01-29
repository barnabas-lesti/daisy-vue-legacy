import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import 'typeface-roboto/index.css';
import '@fortawesome/fontawesome-free/css/all.css';

import store from './store';
import eventService from '../services/event-service';

Vue.use(Vuetify);

const { isDarkTheme } = store.state.core.preferences;

const vuetify = new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
    dark: isDarkTheme,
    themes: {
      light: {},
      dark: {},
    },
  },
});

eventService.$on('core/preferencesUpdated', preferences => {
  vuetify.framework.theme.dark = preferences.isDarkTheme;
});

export default vuetify;
