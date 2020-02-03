const { faker } = require('../core');

const WalletItem = require('../../../../src/server/wallet/models/wallet-item');

const createFakeItem = () => (new WalletItem({
  name: faker.lorem.words(5),
  value: faker.random.number(Number.MAX_SAFE_INTEGER),
})).toObject();

const cleanDb = () => WalletItem.deleteMany({});

const populateDb = async () => {
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push(createFakeItem());
  }
  await WalletItem.insertMany(items);
};

const fetchItemFromDb = (id) => WalletItem.findById(id);

const fetchItemsFromDb = () => WalletItem.find({});

module.exports = {
  cleanDb,
  createFakeItem,
  fetchItemFromDb,
  fetchItemsFromDb,
  populateDb,
};
