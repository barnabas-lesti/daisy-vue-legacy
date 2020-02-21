const faker = require('faker');

const units = [ 'g', 'ml', 'pieces' ];
const randomFloat = (max) => parseFloat((Math.random() * max).toFixed(2)); // Faker random.float() is/was bugged...
const randomUnit = () => units[faker.random.number(units.length - 1)];

const generateUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    email: faker.internet.email(firstName, lastName),
    fullName: faker.name.findName(firstName, lastName),
    password: faker.internet.password(12),
    profileImageUrl: faker.image.avatar(),
  };
};

const generateFood = () => ({
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

const generateMoreFood = (numberOfItems = 5) => Array.from(Array(numberOfItems), () => generateFood());

module.exports = {
  faker,
  generateUser,
  generateFood,
  generateMoreFood,
};
