const faker = require('faker');

const DiaryItem = require('../../../src/server/models/diary-item');

const { randomFloat } = require('./common');
const { createAndSaveFood, createAndSaveRecipe } = require('./diet');

const dateString = () => DiaryItem.convertDateToDateString(faker.date.future());

const createDiaryItem = async (userId, items, dateString) => {
  if (!items || !items.length) {
    const promises = [
      createAndSaveFood(userId),
      createAndSaveRecipe(userId),
    ];
    items = await Promise.all(promises);
  }

  dateString = dateString || DiaryItem.convertDateToDateString(faker.date.past());
  return new DiaryItem({
    userId,
    summary: faker.random.words(4),
    items: items.map(item => ({ amount: randomFloat(2048), ...item })),
    dateString: dateString,
    // "date" is generated from "dateString"
  });
};

const createDiaryItems = async (userId, numberOfItems, dateStrings = []) => {
  numberOfItems = numberOfItems || dateStrings.length || 2;
  const promises = [];
  for (let i = 0; i < numberOfItems; i++) {
    promises.push(createDiaryItem(userId, [], dateString[i]));
  }
  const items = await Promise.all(promises);
  return items;
};

const createAndSaveDiaryItem = async (userId, dateString) => {
  const item = await createDiaryItem(userId, null, dateString);
  const saveableItem = item.convertToSaveable();
  const { _id } = await DiaryItem.Doc.create(saveableItem);
  const doc = await DiaryItem.Doc.findById(_id).populate('items.item');
  const populatedDoc = await DiaryItem.Doc.populate(doc, {
    path: 'items.item.ingredients.food',
    model: 'Food',
  });

  return DiaryItem.convertFromDoc(populatedDoc);
};

const createAndSaveDiaryItems = async (userId, numberOfItems, dateStrings = []) => {
  numberOfItems = numberOfItems || dateStrings.length || 2;
  const promises = [];
  for (let i = 0; i < numberOfItems; i++) {
    promises.push(createAndSaveDiaryItem(userId, dateStrings[i]));
  }
  const items = await Promise.all(promises);
  return items;
};

const findDietItems = async (query = {}) => {
  const docs = await DiaryItem.Doc.find(query);
  return docs.map(doc => DiaryItem.convertFromDoc(doc));
};

module.exports = {
  dateString,
  createDiaryItem,
  createDiaryItems,
  createAndSaveDiaryItem,
  createAndSaveDiaryItems,
  findDietItems,
};
