const path = require('path');
const { logger } = require('@barnabas-lesti/aurora/server');

const config = require('./config');

module.exports = logger({
  label: config.LOGS_LABEL,
  clean: config.env.LOGS_CLEAN_FOLDER,
  toFile: config.env.LOGS_TO_FILE,
  folderPath: config.env.LOGS_FOLDER_ABSOLUTE_PATH || path.join(__dirname, '../../logs'),
});
