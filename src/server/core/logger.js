const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');

const config = require('./config');

const { combine, colorize, label, timestamp, printf } = winston.format;

const LOGS_FOLDER_PATH = path.join(config.private.APP_ROOT_PATH, './logs');

if (config.private.CLEAN_LOGS_FOLDER) cleanLogsFolder();

const baseFormatConfig = [
  label({ label: config.APP_ABBREVIATION }),
  timestamp(),
  printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message.toString()}`),
];

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      ...baseFormatConfig,
    ),
  }),

  ...(config.private.LOG_TO_FILE ? [ new winston.transports.File({
    level: 'info',
    filename: generateLogFilePath(),
  }) ] : []),
];

const logger = winston.createLogger({
  level: config.IS_TEST ? 'error': 'info',
  format: combine(...baseFormatConfig),
  exitOnError: false,
  transports,
});

function generateLogFilePath () {
  const fileName = `${Date.now()}.log`;
  return path.join(LOGS_FOLDER_PATH, fileName);
}

function cleanLogsFolder () {
  if (fs.pathExistsSync(LOGS_FOLDER_PATH)) fs.removeSync(LOGS_FOLDER_PATH);
}

module.exports = logger;
