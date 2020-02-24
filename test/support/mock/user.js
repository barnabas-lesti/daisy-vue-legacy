const faker = require('faker');

class User {
  constructor () {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    this.id = faker.random.uuid();
    this.email = faker.internet.email(firstName, lastName);
    this.password = faker.internet.password(12);
    this.fullName = faker.name.findName(firstName, lastName);
    this.profileImageUrl = faker.image.avatar();
  }
}

module.exports = User;
