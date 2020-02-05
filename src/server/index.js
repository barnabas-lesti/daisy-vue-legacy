const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');
const routes = require('./routes');

class Server {
  constructor () {
    this._expressApp = express();

    this._expressApp.use('*', [
      bodyParser.json(),
    ]);

    this._expressApp.use('/', routes);
  }

  async start () {
    logger.info(`Using configuration: "${config.APP_ENV}"`);
    const server = await this._expressApp.listen(config.APP_PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${config.APP_PORT}`);
  }

  getExpressApp () {
    return this._expressApp;
  }
}

module.exports = {
  server: new Server(),
};
