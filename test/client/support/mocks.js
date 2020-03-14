import faker from 'faker';
import moment from 'moment';

import User from '../../../src/client/models/user';
import Food from '../../../src/client/models/food';
import Recipe from '../../../src/client/models/recipe';
import DietItem from '../../../src/client/models/diet-item';
import DiaryItem from '../../../src/client/models/diary-item';

const authHeader = () => '<authHeaderValue>';
const randomFloat = (max) => parseFloat((Math.random() * max).toFixed(2)); // Faker random.float() is/was bugged...
const randomUnit = () => Food.unitValues[faker.random.number(Food.unitValues.length - 1)];

const getUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return new User({
    id: faker.random.uuid(),
    email: faker.internet.email(firstName, lastName),
    password: faker.internet.password(12),
    fullName: faker.name.findName(firstName, lastName),
    profileImageUrl: faker.image.avatar(),
  });
};

const getFood = (userId) => new Food({
  userId,
  id: faker.random.uuid(),
  name: faker.random.words(4),
  description: faker.random.words(4),
  serving: new Food.Serving({
    unit: randomUnit(),
    value: randomFloat(2048),
  }),
  nutrients: new Food.Nutrients({
    calories: randomFloat(2048),
    carbs: randomFloat(2048),
    fat: randomFloat(2048),
    protein: randomFloat(2048),
  }),
});

const getFoods = (userId, numberOfItems = 5) => [...Array(numberOfItems)].map(() => getFood(userId));

const getRecipe = (userId, foods, numberOfIngredients = 2) => {
  const ingredients = [];
  if (foods && foods.length > 0) {
    while (ingredients.length < numberOfIngredients) {
      const food = foods[faker.random.number(foods.length - 1)];
      if (ingredients.map(item => item.id).indexOf(food.id) === -1) {
        ingredients.push(new Recipe.Ingredient({ amount: randomFloat(2048), ...food }));
      }
    }
  }

  return new Recipe({
    userId,
    id: faker.random.uuid(),
    name: faker.random.words(4),
    description: faker.random.words(4),
    serving: new Food.Serving({
      unit: randomUnit(),
      value: randomFloat(1024),
    }),
    ingredients,
  });
};

const getRecipes = (userId, foods, numberOfItems = 2) => [...Array(numberOfItems)].map(() => getRecipe(userId, foods));

const convertToDietItem = (item) => {
  if (item.ingredients) return DietItem.convertFromRecipe(item);
  else return DietItem.convertFromFood(item);
};

const getDiaryItem = (userId, {
  dietItems = {},
  items = [],
  numberOfItems = 2,
  dateString = moment().format(DiaryItem.Date),
} = {}) => {
  if (items.length < 1) {
    while (items.length < numberOfItems) {
      const food = dietItems.foods[faker.random.number(dietItems.foods.length - 1)];
      const recipe = dietItems.recipes[faker.random.number(dietItems.recipes.length - 1)];
      const candidate = faker.random.boolean() ? food : recipe;
      if (items.map(item => item.id).indexOf(candidate.id) === -1) {
        items.push(convertToDietItem({ amount: randomFloat(2048), ...candidate }));
      }
    }
  }

  return new DiaryItem({
    userId,
    id: faker.random.uuid(),
    summary: faker.random.words(4),
    items,
    dateString,
  });
};

const getDiaryItems = (userId, { dietItems, numberOfItems = 2 }) => {
  const dateStrings = [];
  for (let i = 0; i < numberOfItems; i++) {
    dateStrings.push(moment().subtract(i, 'days').format(DiaryItem.DATE_FORMAT));
  }
  const diaryItems = [];
  for (let i = 0; i < numberOfItems; i++) {
    diaryItems.push(getDiaryItem(userId, { dietItems, dateString: dateStrings[i] }));
  }
  return diaryItems;
};

export default {
  faker,
  moment,

  randomFloat,

  authHeader,
  getUser,

  getFood,
  getFoods,
  getRecipe,
  getRecipes,
  getDiaryItem,
  getDiaryItems,
  convertToDietItem,
};
