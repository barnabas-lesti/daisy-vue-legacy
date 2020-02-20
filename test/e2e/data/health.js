const faker = require('faker');

const units = [ 'g', 'ml', 'pieces' ];
const randomFloat = (max) => parseFloat((Math.random() * max).toFixed(2)); // Faker random.float() is/was bugged...
const randomUnit = () => units[faker.random.number(units.length - 1)];

const generateFood = (userId) => ({
  userId,
  name: faker.random.words(4),
  description: faker.random.words(4),
  serving: {
    unit: randomUnit(),
    value: randomFloat(1024),
  },
  nutrition: {
    calories: randomFloat(4096),
    carbs: randomFloat(2048),
    fat: randomFloat(2048),
    protein: randomFloat(2048),
  },
});

module.exports = {
  generateFood,
};
