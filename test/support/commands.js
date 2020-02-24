import mocks from '../support/mocks';

Cypress.Commands.add('core/signIn', (user) => {
  user = user || mocks.user();
  localStorage.setItem('core/authHeader', JSON.stringify(mocks.authHeader()));
  return cy.server()
    .route({ method: 'GET', url: '/api/auth/profile', status: 200, response: user });
});
