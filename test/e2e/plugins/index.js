const config = require('../../../src/server/config');

module.exports = (on, cypressConfig) => {
  cypressConfig.baseUrl = config.get('TEST_BASE_URL') || config.get('BASE_URL');

  return cypressConfig;
};
