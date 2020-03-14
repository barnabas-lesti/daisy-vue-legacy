const path = require('path');
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '../../env');
const env = require('config');

module.exports = {
  AUTH_HEADER: 'authorization',
  DEFAULT_LOCALE: 'en',
  DIST_FOLDER_PATH: path.join(__dirname, '../../dist'),
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
  DATE_FORMAT: 'YYYY-MM-DD',
  LOGS_LABEL: 'daisy',

  env: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: env.get('PORT'),
    BASE_URL: env.get('BASE_URL'),
    MONGO_URI: env.get('MONGO_URI'),
    REGISTRATION_DISABLED: env.get('REGISTRATION_DISABLED'),

    AUTH_ACCESS_TOKEN_EXPIRATION: env.get('AUTH_ACCESS_TOKEN_EXPIRATION'),
    AUTH_REFRESH_TOKEN_EXPIRATION: env.get('AUTH_REFRESH_TOKEN_EXPIRATION'),
    AUTH_SALT_ROUNDS: env.get('AUTH_SALT_ROUNDS'),
    AUTH_SECRET: env.get('AUTH_SECRET'),

    LOGS_CLEAN_FOLDER: env.get('LOGS_CLEAN_FOLDER'),
    LOGS_TO_FILE: env.get('LOGS_TO_FILE'),
    LOGS_FOLDER_ABSOLUTE_PATH: env.get('LOGS_FOLDER_ABSOLUTE_PATH'),

    DEV_CLIENT_PORT: env.get('DEV_CLIENT_PORT'),
    DEV_API_RESPONSE_DELAY: env.get('DEV_API_RESPONSE_DELAY'),
  },
};
