const mongoose = require('mongoose');

const { private: { MONGO_URI } } = require('./config');
const logger = require('./logger');

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
      const mongoUri = MONGO_URI || await this._createInMemoryMongoDb();
      ({ connection: this._connection } = await mongoose.connect(mongoUri));

      if (MONGO_URI) {
        logger.info('Connected to MongoDB');
        return;
      }
      logger.warn(`MONGO_URI not set, initialized and connected to In-Memory MongoDB`);
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
      return;
    }
    logger.info('No active MongoDB connection, can\'t disconnect');
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
