const faker = require('faker');

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

module.exports = {
  generateUser,
};
