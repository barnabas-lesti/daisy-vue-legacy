import Vue from 'vue';
import VueI18n from 'vue-i18n';

import store from './store';

const { config } = store.state.core;

function loadMessages () {
  const locales = require.context('../../../common/locales', true, /[A-Za-z0-9-_,\s]+\.ya?ml$/i);
  const messages = {};
  for (const key of locales.keys()) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  }
  return messages;
}

Vue.use(VueI18n);

export default new VueI18n({
  locale: config.LOCALES_DEFAULT,
  fallbackLocale: config.LOCALES_DEFAULT,
  messages: loadMessages(),
});
