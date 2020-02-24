import faker from 'faker';

import User from './user';

const generateAuthHeader = () => '<authHeaderValue>';

export default {
  faker,

  generateAuthHeader,
  User,
};
