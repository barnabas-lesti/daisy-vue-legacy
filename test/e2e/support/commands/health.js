Cypress.Commands.add('health/diet/createFood', (foodArray) => {
  const authHeader = window.localStorage.getItem('core.authHeader');
  for (const food of foodArray) {
    cy.request({
      url: '/api/health/diet/food',
      body: food,
      method: 'PUT',
      headers: { 'authorization': authHeader },
    });
  }
});
