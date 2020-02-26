import faker from 'faker';

import User from '../../src/client/core/models/user';
import Food from '../../src/client/health/models/food';
import Recipe from '../../src/client/health/models/recipe';
import CalculableItem from '../../src/client/health/models/calculable-item';

const authHeader = () => '<authHeaderValue>';
const randomFloat = (max) => parseFloat((Math.random() * max).toFixed(2)); // Faker random.float() is/was bugged...
const randomUnit = () => Food.unitValues[faker.random.number(Food.unitValues.length - 1)];

const user = () => {
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

const food = (userId) => new Food({
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

const foods = (userId, numberOfItems = 5) => [...Array(numberOfItems)].map(() => food(userId));

const recipe = (userId, foods, numberOfIngredients = 2) => {
  const ingredients = [];
  if (foods && foods.length > 0) {
    while (ingredients.length < numberOfIngredients) {
      const food = foods[faker.random.number(foods.length - 1)];
      if (ingredients.map(item => item.food.id).indexOf(food.id) === -1) {
        ingredients.push(new Recipe.Ingredient({ amount: randomFloat(2048), food }));
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

const recipes = (userId, foods, numberOfItems = 2) => [...Array(numberOfItems)].map(() => recipe(userId, foods));

const convertToCalculableItem = (item) => {
  if (item.ingredients) return CalculableItem.convertFromRecipe(item);
  else return CalculableItem.convertFromFood(item);
};

export default {
  faker,
  randomFloat,

  authHeader,
  user,

  food,
  foods,
  recipe,
  recipes,
  convertToCalculableItem,
};
