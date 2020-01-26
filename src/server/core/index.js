const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');

class App {
  constructor () {
    this._expressApp = express();
  }

  async start () {
    logger.info(`Using configuration: "${config.NODE_ENV}"`);

    this._expressApp.use('*', [
      bodyParser.json(),
    ]);

    const server = await this._expressApp.listen(config.private.PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${config.private.PORT}`);
  }
}

module.exports = {
  config,
  logger,

  app: new App(),
};
