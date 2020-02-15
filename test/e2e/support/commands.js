const { createUser } = require('../data');

Cypress.Commands.add('registerUser', (user) => {
  user = user || createUser();
  return cy.request('PUT', '/api/auth/register', user);
});

Cypress.Commands.add('signInUser', (user) => {
  user = user || createUser();
  cy.request('POST', '/api/auth/sign-in', user)
    .then(res => {
      const { authHeader } = res.body;
      window.localStorage.setItem('core.authHeader', JSON.stringify(authHeader));
      return res;
    });
});

Cypress.Commands.add('registerAndSignInUser', (user) => {
  user = user || createUser();
  cy.registerUser(user);
  return cy.signInUser(user);
});

Cypress.Commands.add('signOutUser', () => {
  window.localStorage.removeItem('core.authHeader');
  cy.visit('/');
});
