const config = require('./src/server/config');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: config.get('DEV_CLIENT_PORT'),
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
            DEFAULT_LOCALE: config.get('DEFAULT_LOCALE'),
            API_URL: config.get('API_URL'),
            DEV_API_RESPONSE_DELAY: config.get('DEV_API_RESPONSE_DELAY'),
          }),
        });
        return definitions;
      });
  },
};
