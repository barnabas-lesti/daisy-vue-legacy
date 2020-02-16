const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const cors = require('cors');

const config = require('./config');
const logger = require('./logger');

class Server {
  constructor () {
    this._app = express();

    this._app.use([
      bodyParser.json(),
      express.static(config.DIST_FOLDER_PATH),
    ]);
    this._cors();
    this._serviceProxy();
    this._spaResolver();
  }

  async start () {
    logger.info(`Using configuration: "${config.env.NODE_ENV}"`);
    const server = await this._app.listen(config.env.PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${config.env.PORT}`);
  }

  getApp () {
    return this._app;
  }

  _cors () {
    this._app.use(cors({
      exposedHeaders: 'authorization',
    }));
  }

  _serviceProxy () {
    const { SERVICES } = config.env;
    for (const servicePrefix of Object.keys(SERVICES)) {
      this._app.use(`/api/${servicePrefix}`, proxy(SERVICES[servicePrefix]));
    }
  }

  _spaResolver () {
    this._app.use((req, res) => res.sendFile(path.join(config.DIST_FOLDER_PATH, 'index.html')));
  }
}

module.exports = new Server();
