import Vue from 'vue';
import VueI18n from 'vue-i18n';

import store from './store';

const { config } = store.state.core;

Vue.use(VueI18n);

class I18n {
  constructor () {
    this._vueI18n = new VueI18n({
      locale: config.DEFAULT_LOCALE,
      fallbackLocale: config.DEFAULT_LOCALE,
      messages: this._loadMessages(),
    });
  }

  getVueI18n () {
    return this._vueI18n;
  }

  _loadMessages () {
    const locales = require.context('../../common/locales', true, /[A-Za-z0-9-_,\s]+\.ya?ml$/i);
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
}

export default new I18n();
