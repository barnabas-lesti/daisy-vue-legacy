const config = require('./src/server/core/config');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: config.private.CLIENT_DEV_SERVER_PORT,
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
        const { private: privateEnvConfig, ...publicEnvConfig } = config;
        definitions[0] = Object.assign(definitions[0], {
          'window.publicEnvConfig': JSON.stringify(publicEnvConfig),
        });
        return definitions;
      });
  },
};
