const config = require('./src/server/config');

const BASE_URL = config.get('BASE_URL');
const DEFAULT_LOCALE = config.get('DEFAULT_LOCALE');
const DEV_API_RESPONSE_DELAY = config.get('DEV_API_RESPONSE_DELAY');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: config.get('DEV_CLIENT_PORT'),
    proxy: {
      '/api': {
        target: BASE_URL,
      },
    },
  },

  transpileDependencies: [
    'vuetify',
  ],

  pluginOptions: {
    i18n: {
      enableInSFC: false,
    },
  },

  chainWebpack: webpackConfig => {
    webpackConfig.module
      .rule('yaml')
      .test(/\.ya?ml$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('yaml-loader')
      .loader('yaml-loader')
      .end();

    webpackConfig
      .plugin('define')
      .tap(definitions => {
        definitions[0] = Object.assign(definitions[0], {
          'window.appConfig': JSON.stringify({
            BASE_URL,
            DEFAULT_LOCALE,
            DEV_API_RESPONSE_DELAY,
          }),
        });
        return definitions;
      });
  },
};
