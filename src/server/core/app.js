const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');

const expressApp = express();

class App {
  async start () {
    logger.info(`Using configuration: "${config.NODE_ENV}"`);

    expressApp.use('*', [
      bodyParser.json(),
    ]);

    const server = await expressApp.listen(config.PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${config.PORT}`);
  }
}

module.exports = new App();
