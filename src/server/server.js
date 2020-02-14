const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');
const routes = require('./routes');

const NODE_ENV = process.env.NODE_ENV;
const PORT = config.get('PORT');

const app = express();

class Server {
  constructor () {
    app.use('*', [
      bodyParser.json(),
    ]);

    app.use(express.static(path.join(__dirname, '../../dist')));
    app.use('/', routes);
  }

  async start () {
    logger.info(`Using configuration: "${NODE_ENV}"`);
    const server = await app.listen(PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${PORT}`);
  }

  getApp () {
    return app;
  }
}

module.exports = new Server();
