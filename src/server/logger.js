const path = require('path');
const fs = require('fs-extra');
const winston = require('winston');
const { combine, colorize, label, timestamp, printf } = winston.format;

const config = require('./config');

const ABBREVIATION = config.get('ABBREVIATION');
const IS_TEST = process.env.NODE_ENV === 'test';
const LOGS_CLEAN_FOLDER = config.get('LOGS_CLEAN_FOLDER');
const LOGS_TO_FILE = config.get('LOGS_TO_FILE');
const LOGS_FOLDER_PATH = config.get('LOGS_FOLDER_ABSOLUTE_PATH') || path.join(__dirname, '../../logs');

if (LOGS_CLEAN_FOLDER) cleanLogsFolder();

const baseFormat = [
  label({ label: ABBREVIATION }),
  timestamp(),
  colorize(),
  printf(({ timestamp, label, level, message, stack }) => {
    return `${timestamp} [${label}] ${level}: ${message}` + (stack ? `\n${stack}` : '');
  }),
];

const transports = [
  new winston.transports.Console(),
];

if (LOGS_TO_FILE) {
  transports.push(new winston.transports.File({
    level: 'info',
    filename: generateLogFilePath(),
  }));
}

const logger = winston.createLogger({
  level: IS_TEST ? 'error': 'info',
  format: combine(...baseFormat),
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
