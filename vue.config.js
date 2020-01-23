const config = require('./src/server/core/config');

module.exports = {
  lintOnSave: false,

  devServer: {
    port: config.CLIENT_DEV_SERVER_PORT,
  },

  transpileDependencies: [
    'vuetify',
  ],

  pluginOptions: {
    i18n: {
      enableInSFC: false,
    },
  },

  chainWebpack: config => {
    config.module
      .rule('yaml')
      .test(/\.ya?ml$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('yaml-loader')
      .loader('yaml-loader')
      .end();
  },
};
