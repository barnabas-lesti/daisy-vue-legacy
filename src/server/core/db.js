const mongoose = require('mongoose');

const config = require('./config');
const logger = require('./logger');

const MONGO_URI = config.get('private.core.MONGO_URI');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = Promise;

class Db {
  constructor () {
    this._connection = null;
  }

  async connect () {
    try {
      const mongoUriFromConfig = MONGO_URI;
      if (mongoUriFromConfig) {
        logger.info('Connecting to MongoDB...');
        ({ connection: this._connection } = await mongoose.connect(mongoUriFromConfig));
        logger.info('Connected to MongoDB');
      } else {
        const inMemoryMongoUri = await this._createInMemoryMongoDb();
        ({ connection: this._connection } = await mongoose.connect(inMemoryMongoUri));
        logger.warn(`MONGO_URI not set, initialized and connected to In-Memory MongoDB`);
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async disconnect () {
    if (this._connection) {
      await this._connection.close();
      this._connection = null;
      logger.success('Disconnected from MongoDB');
    } else {
      logger.info('No active MongoDB connection, can\'t disconnect');
    }
  }

  async _createInMemoryMongoDb () {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const inMemoryMongoDb = new MongoMemoryServer();
    const inMemoryMongoUri = await inMemoryMongoDb.getConnectionString();
    return inMemoryMongoUri;
  }
}

module.exports = {
  db: new Db(),
  DbTypes: mongoose.Types,
};
