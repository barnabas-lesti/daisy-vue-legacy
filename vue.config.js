const env = require('./env');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: 3000,
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
            LOCALES_DEFAULT: env.get('LOCALES_DEFAULT'),
          }),
        });
        return definitions;
      });
  },
};
