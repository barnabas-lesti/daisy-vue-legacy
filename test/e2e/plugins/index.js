const config = require('../../../src/server/config');

module.exports = (on, cypressConfig) => {
  cypressConfig.baseUrl = config.env.TEST_BASE_URL || config.env.BASE_URL;
  return cypressConfig;
};
