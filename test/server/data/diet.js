const faker = require('faker');

const Food = require('../../../src/server/models/food');
const Recipe = require('../../../src/server/models/recipe');

const { randomFloat } = require('./common');

const randomUnit = () => Food.unitValues[faker.random.number(Food.unitValues.length - 1)];

/**
 * @param {String=} userId
 */
const createFood = (userId) => {
  return new Food({
    userId,
    name: faker.random.words(4),
    description: faker.random.words(8),
    nutrients: {
      calories: randomFloat(4096),
      carbs: randomFloat(2048),
      fat: randomFloat(2048),
      protein: randomFloat(2048),
    },
    serving: {
      unit: randomUnit(),
      value: randomFloat(1024),
    },
  });
};

/**
 * @param {String} userId
 * @returns {Food}
 */
const createAndSaveFood = async (userId) => {
  const doc = await Food.Doc.create(createFood(userId));
  return new Food(doc.toObject());
};

/**
 * @param {String} userId
 * @param {Number} numberOfItems
 * @returns {Food[]}
 */
const createAndSaveFoods = async (userId, numberOfItems = 5) => {
  const items = [];
  for (let i = 0; i < numberOfItems; i++) {
    items.push(createFood(userId));
  }
  const docs = await Food.Doc.insertMany(items);
  return docs.map(doc => new Food(doc));
};

const findFoods = async (query = {}) => {
  const doc = await Food.Doc.find(query);
  return doc;
};

/**
 * @param {String=} userId
 */
const createRecipe = async (userId, foods = []) => {
  if (!foods.length) {
    foods.push(await createAndSaveFood(userId));
  }

  return new Recipe({
    userId,
    name: faker.random.words(4),
    description: faker.random.words(8),
    ingredients: [
      ...foods.map(food => new Recipe.Ingredient({ ...food, amount: randomFloat(1024) })),
    ],
    serving: {
      unit: randomUnit(),
      value: randomFloat(1024),
    },
  });
};

/**
 * @param {String} userId
 * @returns {Recipe}
 */
const createAndSaveRecipe = async (userId) => {
  const recipe = await createRecipe(userId);
  const saveable = Recipe.convertToSaveable(recipe);
  const { _id } = await Recipe.Doc.create(saveable);
  const doc = await Recipe.Doc.findById(_id).populate('ingredients.food');
  return Recipe.convertFromDoc(doc);
};

/**
 * @param {String} userId
 * @param {Number} numberOfItems
 * @returns {Recipe[]}
 */
const createAndSaveRecipes = async (userId, numberOfItems = 5) => {
  const promises = [];
  for (let i = 0; i < numberOfItems; i++) {
    promises.push(createAndSaveRecipe(userId));
  }
  const recipes = await Promise.all(promises);
  return recipes;
};

const findRecipes = async (query = {}) => {
  const doc = await Recipe.Doc.find(query);
  return doc;
};

module.exports = {
  createFood,
  createAndSaveFood,
  createAndSaveFoods,
  findFoods,

  createRecipe,
  createAndSaveRecipe,
  createAndSaveRecipes,
  findRecipes,
};
