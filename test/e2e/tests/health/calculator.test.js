const data = require('../../data');

let foodArray;

describe('Health / Calculator', () => {
  it('Should be reachable from the sidebar (Desktop)', () => {
    cy['auth/signIn']();
    navigateTo();
  });

  it('Should be reachable from the sidebar (Mobile)', () => {
    cy['auth/signIn']();
    cy.viewport('iphone-6');
    navigateTo();
  });

  it('User should be able to add items to the calculator (Desktop)', () => {
    cy['auth/signIn']();
    prepareFood();
    const food = foodArray[0];
    cy.visit('/health/calculator');

    cy.get('[data-qa="views.calculator.changeItems"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.desktop.cancel"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('not.exist');

    cy.get('[data-qa="views.calculator.changeItems"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.desktop.confirm"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('exist');

    cy.get('[data-qa="views.calculator.changeItems"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.desktop.confirm"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('not.exist');
  });

  it('User should be able to add items to the calculator (Mobile)', () => {
    cy['auth/signIn']();
    prepareFood();
    const food = foodArray[0];
    cy.viewport('iphone-6');
    cy.visit('/health/calculator');

    cy.get('[data-qa="views.calculator.fab"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.mobile.cancel"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('not.exist');

    cy.get('[data-qa="views.calculator.fab"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.mobile.confirm"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('exist');

    cy.get('[data-qa="views.calculator.fab"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.mobile.confirm"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('not.exist');
  });

  it('Items should remain in the table after SPA navigation', () => {
    cy['auth/signIn']();
    prepareFood();
    const food = foodArray[0];
    cy.visit('/health/calculator');

    cy.get('[data-qa="views.calculator.changeItems"]').click();
    cy.get('[data-qa="modal.content"]').contains(food.name).click();
    cy.get('[data-qa="modal.desktop.confirm"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('exist');

    cy.get('[data-qa="navbar.sidebarToggle"]').click();
    cy.get('[data-qa="sidebar.dashboard.link"]').click();
    cy.get('[data-qa="sidebar.health.calculator.link"]').click();
    cy.get('[data-qa="views.calculator.mainTable"]').contains(food.name).should('exist');
  });
});

function navigateTo () {
  cy.visit('/');

  cy.get('[data-qa="navbar.sidebarToggle"]').click();
  cy.get('[data-qa="sidebar.health.link"]').click();
  cy.get('[data-qa="sidebar.health.calculator.link"]').should('be.visible').click();
  cy.url().should('include', '/health/calculator');
}

function prepareFood (numberOfItems = 5) {
  foodArray = data.generateMoreFood(numberOfItems);
  return cy['health/diet/createFood'](foodArray);
}
