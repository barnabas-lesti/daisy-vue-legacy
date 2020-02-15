const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const cors = require('cors');

const config = require('./config');
const logger = require('./logger');

const NODE_ENV = process.env.NODE_ENV;
const PORT = config.get('PORT');
const SERVICES = config.get('SERVICES');
const DIST_FOLDER_PATH = path.join(__dirname, '../../dist');

class Server {
  constructor () {
    this._app = express();

    this._app.use([
      bodyParser.json(),
      express.static(DIST_FOLDER_PATH),
    ]);
    this._cors();
    this._serviceProxy();
    this._spaResolver();
  }

  async start () {
    logger.info(`Using configuration: "${NODE_ENV}"`);
    const server = await this._app.listen(PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${PORT}`);
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
    for (const servicePrefix of Object.keys(SERVICES)) {
      this._app.use(`/api/${servicePrefix}`, proxy(SERVICES[servicePrefix]));
    }
  }

  _spaResolver () {
    this._app.use((req, res) => res.sendFile(path.join(DIST_FOLDER_PATH, 'index.html')));
  }
}

module.exports = new Server();
