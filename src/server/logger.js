const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');

const config = require('./config');

const LOGS_FOLDER_PATH = config.LOGS_FOLDER_ABSOLUTE_PATH || config.LOGS_FOLDER_RELATIVE_PATH;

const { combine, colorize, label, timestamp, printf } = winston.format;

if (config.LOGS_CLEANUP) cleanLogsFolder();

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

  ...(config.LOGS_TO_FILE ? [ new winston.transports.File({
    level: 'info',
    filename: generateLogFilePath(),
  }) ] : []),
];

const logger = winston.createLogger({
  level: config.APP_IS_TEST ? 'error': 'info',
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

logger.info('Logger initialized ' +
  (config.LOGS_TO_FILE ? `(folder: "${LOGS_FOLDER_PATH}", cleanup: ${config.LOGS_CLEANUP})` : '(only console)'));

module.exports = logger;
