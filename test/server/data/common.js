const mongoose = require('mongoose');
const faker = require('faker');
const moment = require('moment');

const randomFloat = (max) => parseFloat((Math.random() * max).toFixed(2)); // Faker random.float() is/was bugged...
const randomId = () => `${mongoose.Types.ObjectId()}`;

const cleanDb = () => {
  return new Promise((resolve, reject) => {
    const { collections } = mongoose.connection;
    for (const collection of Object.keys(collections)) {
      collections[collection].drop(error => reject(error));
    }
    resolve();
  });
};

module.exports = {
  faker,
  moment,
  cleanDb,
  randomFloat,
  randomId,
};
