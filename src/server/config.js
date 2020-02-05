const path = require('path');

const env = require('../../env');

const APP_ROOT_PATH = path.join(__dirname, '../../');

module.exports = {
  APP_ROOT_PATH,
  APP_ABBREVIATION: 'awa',
  APP_PORT: env.get('APP_PORT'),
  APP_ENV: process.env.NODE_ENV,
  APP_IS_TEST: process.env.NODE_ENV === 'test',

  LOGS_TO_FILE: env.get('LOGS_TO_FILE'),
  LOGS_FOLDER_ABSOLUTE_PATH: env.get('LOGS_FOLDER_ABSOLUTE_PATH'),
  LOGS_FOLDER_RELATIVE_PATH: path.join(APP_ROOT_PATH, env.get('LOGS_FOLDER_RELATIVE_PATH')),
  LOGS_CLEANUP: env.get('LOGS_CLEANUP'),
};
