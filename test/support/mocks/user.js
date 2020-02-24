import faker from 'faker';

import User from '../../../src/client/core/models/user';

export default class MockUser extends User {
  constructor () {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    super({
      id: faker.random.uuid(),
      email: faker.internet.email(firstName, lastName),
      password: faker.internet.password(12),
      fullName: faker.name.findName(firstName, lastName),
      profileImageUrl: faker.image.avatar(),
    });
  }
}
