import Vue from 'vue';

const { appConfig } = window;

const config = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,

  API_URL: appConfig.API_URL,
  DEFAULT_LOCALE: appConfig.DEFAULT_LOCALE,
  BASE_URL: appConfig.BASE_URL,
  DEV_API_RESPONSE_DELAY: appConfig.DEV_API_RESPONSE_DELAY,
};

Vue.prototype.$config = config;

export default config;
