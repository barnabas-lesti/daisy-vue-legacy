const path = require('path');
const env = require('@barnabas-lesti/aurora/server/config');

env(path.join(__dirname, '../../env'));

module.exports = {
  AUTH_HEADER: 'authorization',
  DEFAULT_LOCALE: 'en',
  DIST_FOLDER_PATH: path.join(__dirname, '../../dist'),
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
  LOGS_LABEL: 'awa',

  env: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: env().get('PORT'),
    BASE_URL: env().get('BASE_URL'),
    SERVICES: env().get('SERVICES'),

    LOGS_CLEAN_FOLDER: env().get('LOGS_CLEAN_FOLDER'),
    LOGS_TO_FILE: env().get('LOGS_TO_FILE'),
    LOGS_FOLDER_ABSOLUTE_PATH: env().get('LOGS_FOLDER_ABSOLUTE_PATH'),

    DEV_CLIENT_PORT: env().get('DEV_CLIENT_PORT'),
    DEV_API_RESPONSE_DELAY: env().get('DEV_API_RESPONSE_DELAY'),
  },
};
