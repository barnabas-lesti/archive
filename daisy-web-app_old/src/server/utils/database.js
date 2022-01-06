const mongoose = require('mongoose');

const { MONGO_URI } = require('../../../env.config');
const logger = require('./logger');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.Promise = Promise;

class Database {
  constructor () {
    this._connection = null;
  }

  async connect () {
    try {
      if (MONGO_URI) {
        ({ connection: this._connection } = await mongoose.connect(MONGO_URI));
        logger.success('Connected to MongoDB');
      } else {
        logger.info('MONGO_URI not set, skipping MongoDB connection');
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  async disconnect () {
    if (this._connection) {
      await this._connection.close();
      logger.success('Disconnected from MongoDB');
    } else {
      logger.info('No active MongoDB connection, can\'t disconnect');
    }
  }
}

module.exports = Database;
