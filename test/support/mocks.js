import faker from 'faker';

import { User } from '../../src/client/core/models';
import { Food } from '../../src/client/health/models';

const randomFloat = (max) => parseFloat((Math.random() * max).toFixed(2)); // Faker random.float() is/was bugged...
const randomUnit = () => Food.unitValues[faker.random.number(Food.unitValues.length - 1)];
const authHeader = () => '<authHeaderValue>';

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

const oneFood = (userId) => {
  return new Food({
    userId,
    id: faker.random.uuid(),
    name: faker.random.words(4),
    description: faker.random.words(4),
    serving: {
      unit: randomUnit(),
      value: randomFloat(1024),
    },
    nutrients: {
      calories: randomFloat(4096),
      carbs: randomFloat(2048),
      fat: randomFloat(2048),
      protein: randomFloat(2048),
    },
  });
};

const moreFood = (userId, numberOfItems = 5) => {
  return [...Array(numberOfItems)].map(() => oneFood(userId));
};

export default {
  faker,

  authHeader,
  user,

  oneFood,
  moreFood,
};
