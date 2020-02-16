const config = require('./src/server/config');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: config.env.DEV_CLIENT_PORT,
    proxy: {
      '/api': {
        target: config.env.BASE_URL,
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
        const { AUTH_HEADER, EMAIL_REGEX, DEFAULT_LOCALE, env: { BASE_URL, DEV_API_RESPONSE_DELAY } } = config;
        definitions[0] = Object.assign(definitions[0], {
          'window.__AURORA_CONFIG__': JSON.stringify({
            AUTH_HEADER,
            EMAIL_REGEX,
            DEFAULT_LOCALE,
            env: {
              BASE_URL,
              DEV_API_RESPONSE_DELAY,
            },
          }),
        });
        return definitions;
      });
  },
};
