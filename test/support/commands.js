import mocks from '../support/mocks';
import stubs from '../support/stubs';

// Cypress.Commands.add('auth/registerUser', () => {
//   const user = data.generateUser();
//   return cy.request('PUT', '/api/auth/register', user);
// });

Cypress.Commands.add('core/signIn', (user) => {
  user = user || new mocks.User();
  localStorage.setItem('core/authHeader', JSON.stringify(mocks.generateAuthHeader()));
  return stubs['auth/profile']['get/200/ok'](user);
});

// Cypress.Commands.add('auth/signOut', () => {
//   window.localStorage.removeItem('core/authHeader');
// });

// Cypress.Commands.add('health/diet/createFood', (foodArray) => {
//   const authHeader = window.localStorage.getItem('core/authHeader');
//   for (const food of foodArray) {
//     cy.request({
//       url: '/api/health/diet/food',
//       body: food,
//       method: 'PUT',
//       headers: { 'authorization': authHeader },
//     });
//   }
// });
