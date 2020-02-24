import faker from 'faker';

import { User } from '../../src/client/core/models';

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

export default {
  faker,

  authHeader,
  user,
};
