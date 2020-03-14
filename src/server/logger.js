const path = require('path');
const fs = require('fs-extra');
const { transports: { Console, File }, format, createLogger } = require('winston');

const config = require('./config');

const LABEL = config.LOGS_LABEL;
const TO_FILE = config.env.LOGS_TO_FILE;
const FOLDER_PATH = config.env.LOGS_FOLDER_ABSOLUTE_PATH || path.join(__dirname, '../../logs');

if (config.env.LOGS_CLEAN_FOLDER) cleanLogsFolder(FOLDER_PATH);

const baseFormat = [
  format.label({ label: LABEL }),
  format.timestamp(),
  format.colorize(),
  format.printf(({ timestamp, label, level, message, stack }) => {
    return `${timestamp} [${label}] ${level}: ${message}` + (stack ? `\n${stack}` : '');
  }),
];

const transports = [
  new Console(),
];

if (TO_FILE) {
  transports.push(new File({
    level: 'info',
    filename: generateLogFilePath(FOLDER_PATH),
  }));
}

module.exports = createLogger({
  level: process.env.NODE_ENV === 'test' ? 'error': 'info',
  format: format.combine(...baseFormat),
  exitOnError: false,
  transports,
});

/**
 * @param {String} logsFolderPath
 */
function generateLogFilePath (logsFolderPath) {
  const fileName = `${Date.now()}.log`;
  return path.join(logsFolderPath, fileName);
}

/**
 * @param {String} logsFolderPath
 */
function cleanLogsFolder (logsFolderPath) {
  if (fs.pathExistsSync(logsFolderPath)) fs.removeSync(logsFolderPath);
}
