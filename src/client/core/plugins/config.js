import Vue from 'vue';

const { __AURORA_CONFIG__: appConfig } = window;

const config = {
  AUTH_HEADER: appConfig.AUTH_HEADER,
  EMAIL_REGEX: new RegExp(appConfig.EMAIL_REGEX),
  DEFAULT_LOCALE: appConfig.DEFAULT_LOCALE,

  env: {
    BASE_URL: appConfig.env.BASE_URL,
    DEV_API_RESPONSE_DELAY: appConfig.env.DEV_API_RESPONSE_DELAY,
  },
};

Vue.prototype.$config = config;

export default config;
