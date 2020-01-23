const path = require('path');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv.config());

const APP_ROOT_PATH = path.join(__dirname, '../../../');
const packageJson = require(path.join(APP_ROOT_PATH, 'package.json'));

module.exports = {
  APP_NAME: packageJson.name,
  APP_VERSION: packageJson.version,
  APP_ABBREVIATION: packageJson.app.abbreviation,

  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  PORT: process.env.PORT || 8080,

  APP_ROOT_PATH: path.join(__dirname, '../../../'),

  LOG_TO_FILE: process.env.LOG_TO_FILE,
  CLEAN_LOGS_FOLDER: process.env.CLEAN_LOGS_FOLDER,
};
