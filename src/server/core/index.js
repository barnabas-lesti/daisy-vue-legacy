const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');
const router = require('./router');
const { db, DbTypes } = require('./db');

require('./routes');

const NODE_ENV = process.env.NODE_ENV;
const PORT = config.get('private.core.PORT');

class App {
  constructor () {
    this._expressApp = express();
  }

  async start () {
    logger.info(`Using configuration: "${NODE_ENV}"`);

    this._expressApp.use('*', [
      bodyParser.json(),
    ]);

    this._expressApp.use('/api', router);

    db.connect();

    const server = await this._expressApp.listen(PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${PORT}`);
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
