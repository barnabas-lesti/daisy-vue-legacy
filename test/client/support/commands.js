import mocks from '../support/mocks';
import stubs from '../support/stubs';

Cypress.Commands.add('auth/signIn', (user) => {
  user = user || mocks.getUser();
  localStorage.setItem('auth/authHeader', JSON.stringify(mocks.authHeader()));
  return stubs['auth/user'](user);
});
