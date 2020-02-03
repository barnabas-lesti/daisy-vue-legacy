const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');

const config = require('./config');

const APP_ABBREVIATION = config.get('private.core.APP_ABBREVIATION');
const CLEAN_LOGS_FOLDER = config.get('private.core.CLEAN_LOGS_FOLDER');
const LOG_TO_FILE = config.get('private.core.LOG_TO_FILE');
const LOGS_FOLDER_PATH = path.join(__dirname, '../../../logs');
const IS_TEST = process.env.NODE_ENV === 'test';

const { combine, colorize, label, timestamp, printf } = winston.format;

if (CLEAN_LOGS_FOLDER) cleanLogsFolder();

const baseFormatConfig = [
  label({ label: APP_ABBREVIATION }),
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

  ...(LOG_TO_FILE ? [ new winston.transports.File({
    level: 'info',
    filename: generateLogFilePath(),
  }) ] : []),
];

const logger = winston.createLogger({
  level: IS_TEST ? 'error': 'info',
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
