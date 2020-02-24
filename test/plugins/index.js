const { env } = require('../../src/server/config');

module.exports = (on, config) => {
  config.baseUrl = env.BASE_URL;
  return config;
};
