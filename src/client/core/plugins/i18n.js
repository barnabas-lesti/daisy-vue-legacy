import Vue from 'vue';
import VueI18n from 'vue-i18n';

import config from './config';

import messages from '../../../common/messages';

Vue.use(VueI18n);

export default new VueI18n({
  locale: config.DEFAULT_LOCALE,
  fallbackLocale: config.DEFAULT_LOCALE,
  messages,
});
