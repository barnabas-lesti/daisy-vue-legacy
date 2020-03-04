import mocks from '../support/mocks';
import stubs from '../support/stubs';

Cypress.Commands.add('core/signIn', (user) => {
  user = user || mocks.getUser();
  localStorage.setItem('core/authHeader', JSON.stringify(mocks.authHeader()));
  return stubs['core/user'](user);
});
