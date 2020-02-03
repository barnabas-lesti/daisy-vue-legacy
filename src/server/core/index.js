const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');
const router = require('./router');
const { db, DbTypes } = require('./db');

class App {
  constructor () {
    this._expressApp = express();
  }

  async start () {
    logger.info(`Using configuration: "${config.NODE_ENV}"`);

    this._expressApp.use('*', [
      bodyParser.json(),
    ]);

    this._expressApp.use('/api', router);

    db.connect();

    const server = await this._expressApp.listen(config.private.PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${config.private.PORT}`);
  }

  getExpressApp () {
    return this._expressApp;
  }
}

module.exports = {
  config,
  logger,
  router,

  DbTypes,

  app: new App(),
};
