const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config');
const logger = require('./logger');
const db = require('./db');

class Server {
  constructor () {
    this._app = express();
    this._apiRouters = {};
  }

  async start () {
    this._handleErrors();
    this._initRoutes();
    db.connect();

    logger.info(`Using configuration: "${config.env.NODE_ENV}"`);
    const server = await this._app.listen(config.env.PORT);
    const { address } = server.address();
    logger.info(`Server running at http://${address}:${config.env.PORT}`);
  }

  addApiRouters (domain, routers) {
    if (!this._apiRouters[domain]) this._apiRouters[domain] = [];
    this._apiRouters[domain].push(...routers);
  }

  getApp () {
    return this._app;
  }

  _handleErrors () {
    process.on('uncaughtException', error => logger.error(error));
    process.on('unhandledRejection', error => logger.error(error));
  }

  _initRoutes () {
    // Common file and parser setup
    this._app.use([
      bodyParser.json(),
      cors({ exposedHeaders: config.AUTH_HEADER }),
      express.static(config.DIST_FOLDER_PATH),
    ]);

    // API routes
    const routes = require('./routes');
    this._app.use('/api', [
      require('./middlewares/auth/seed')(),
      ...routes.public,

      require('./middlewares/auth/guard')(),
      ...routes.private,

      (req, res, next) => res.status(404).send(),
    ]);

    // SPA resolver
    this._app.use((req, res) => res.sendFile(path.join(config.DIST_FOLDER_PATH, 'index.html')));
  }
}

module.exports = new Server();
