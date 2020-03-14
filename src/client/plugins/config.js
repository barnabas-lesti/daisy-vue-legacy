import Vue from 'vue';

const { __APP_CONFIG__ } = window;

const config = {
  AUTH_HEADER: __APP_CONFIG__.AUTH_HEADER,
  EMAIL_REGEX: new RegExp(__APP_CONFIG__.EMAIL_REGEX),
  DATE_FORMAT: __APP_CONFIG__.DATE_FORMAT,
  DEFAULT_LOCALE: __APP_CONFIG__.DEFAULT_LOCALE,

  env: {
    BASE_URL: __APP_CONFIG__.env.BASE_URL,
    DEV_API_RESPONSE_DELAY: __APP_CONFIG__.env.DEV_API_RESPONSE_DELAY,
  },
};

Vue.prototype.$config = config;

export default config;
