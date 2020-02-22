const data = require('../../../data');

let foodArray;

describe('Health / Diet / Food', () => {
  it('Should be reachable from the sidebar (Desktop)', () => {
    cy['auth/signIn']();
    navigateToDiet();
  });

  it('Should be reachable from the sidebar (Mobile)', () => {
    cy['auth/signIn']();
    cy.viewport('iphone-6');
    navigateToDiet();
  });

  it('Should create a new food (Desktop)', () => {
    cy['auth/signIn']();

    const food = data.generateFood();
    cy.visit('/health/diet');

    cy.get('[data-qa="components.foodModal.create"]').click();
    cy.get('[data-qa="components.foodModal.form"]').should('be.visible');
    cy.get('[data-qa="components.foodModal.form"]').submit();
    cy.get('[data-qa="components.foodModal.form"]').contains(/name.*required/i).should('be.visible');

    fillInForm(food);
    cy.get('[data-qa="modal.desktop.confirm"]').should('be.visible').click();
    cy.get('[data-qa="components.foodModal.form"]').should('not.be.visible');

    cy.get('[data-qa="health.components.dietTable"]').get('tbody').find('tr').eq(0).click();
    verifyFieldsInForm(food);
    cy.get('[data-qa="modal.desktop.cancel"]').click();
    cy.get('[data-qa="components.foodModal.form"]').should('not.be.visible');
  });

  it('Should create a food item (Mobile)', () => {
    cy['auth/signIn']();

    const food = data.generateFood();
    cy.viewport('iphone-6');
    cy.visit('/health/diet');

    cy.get('[data-qa="views.diet.fab"]').click();
    cy.get('[data-qa="views.diet.fab.newFood"]').should('be.visible').click();
    cy.get('[data-qa="components.foodModal.form"]').should('be.visible');
    cy.get('[data-qa="components.foodModal.form"]').submit();
    cy.get('[data-qa="components.foodModal.form"]').contains(/name.*required/i).should('be.visible');

    fillInForm(food);
    cy.get('[data-qa="modal.mobile.confirm"]').click();
    cy.get('[data-qa="modal.content"]').should('not.be.visible');
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).click();
    verifyFieldsInForm(food);
    cy.get('[data-qa="modal.mobile.cancel"]').click();
    cy.get('[data-qa="modal.content"]').should('not.be.visible');
  });

  it('Should update a food item', () => {
    cy['auth/signIn']();
    prepareFood();

    const food = foodArray[0];
    const update = data.generateFood();
    cy.visit('/health/diet');

    verifyFieldsInTableRow(food);
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).click();
    fillInForm(update);
    cy.get('[data-qa="components.foodModal.form"]').submit();

    cy.reload();
    cy.get('[data-qa="views.diet.search"]').type(food.name);
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).should('not.exist');
    cy.get('[data-qa="views.diet.search"]').clear().type(update.name);
    verifyFieldsInTableRow(update);
  });

  it('Should delete a food item (Desktop)', () => {
    cy['auth/signIn']();
    prepareFood();

    const food = foodArray[0];
    cy.visit('/health/diet');

    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).click();
    cy.get('[data-qa="modal.desktop.remove"]').click();
    cy.get('[data-qa="modal.remove.cancel"]').click();
    cy.get('[data-qa="modal.desktop.cancel"]').click();
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).should('exist');

    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).click();
    cy.get('[data-qa="modal.desktop.remove"]').click();
    cy.get('[data-qa="modal.remove.confirm"]').click();
    cy.reload();
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).should('not.exist');
  });

  it('Should delete a food item (Mobile)', () => {
    cy['auth/signIn']();
    cy.viewport('iphone-6');
    prepareFood();

    const food = foodArray[0];
    cy.visit('/health/diet');

    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).click();
    cy.get('[data-qa="modal.mobile.remove"]').click();
    cy.get('[data-qa="modal.remove.cancel"]').click();
    cy.get('[data-qa="modal.mobile.cancel"]').click();
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).should('exist');

    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).click();
    cy.get('[data-qa="modal.mobile.remove"]').click();
    cy.get('[data-qa="modal.remove.confirm"]').click();
    cy.reload();
    cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).should('not.exist');
  });
});

function navigateToDiet () {
  cy.visit('/');

  cy.get('[data-qa="navbar.sidebarToggle"]').click();
  cy.get('[data-qa="sidebar.health.link"]').click();
  cy.get('[data-qa="sidebar.health.diet.link"]').should('be.visible').click();
  cy.url().should('include', '/health/diet');
}

function prepareFood (numberOfItems = 5) {
  foodArray = data.generateMoreFood(numberOfItems);
  return cy['health/diet/createFood'](foodArray);
}

function fillInForm (food) {
  cy.get('[data-qa="components.foodModal.form.name"]').clear().type(food.name);
  cy.get('[data-qa="components.foodModal.form.description"]').clear().type(food.description);
  cy.get('[data-qa="components.foodModal.form.serving.unit"]').click();
  cy.get('.v-select-list').contains(food.serving.unit).click();
  cy.get('[data-qa="components.foodModal.form.serving.value"]').clear().type(food.serving.value);
  cy.get('[data-qa="components.foodModal.form.calories"]').clear().type(food.nutrients.calories);
  cy.get('[data-qa="components.foodModal.form.carbs"]').clear().type(food.nutrients.carbs);
  cy.get('[data-qa="components.foodModal.form.protein"]').clear().type(food.nutrients.protein);
  cy.get('[data-qa="components.foodModal.form.fat"]').clear().type(food.nutrients.fat);
}

function verifyFieldsInForm (food) {
  cy.get('[data-qa="components.foodModal.form.name"]').invoke('val').should('eq', food.name);
  cy.get('[data-qa="components.foodModal.form.description"]').invoke('val').should('eq', food.description);
  cy.get('[data-qa="components.foodModal.form.serving.unit"]').get('[name="servingUnit"]').invoke('val').should('eq', food.serving.unit);
  cy.get('[data-qa="components.foodModal.form.serving.value"]').invoke('val').should('eq', `${food.serving.value}`);
  cy.get('[data-qa="components.foodModal.form.calories"]').invoke('val').should('eq', `${food.nutrients.calories}`);
  cy.get('[data-qa="components.foodModal.form.carbs"]').invoke('val').should('eq', `${food.nutrients.carbs}`);
  cy.get('[data-qa="components.foodModal.form.protein"]').invoke('val').should('eq', `${food.nutrients.protein}`);
  cy.get('[data-qa="components.foodModal.form.fat"]').invoke('val').should('eq', `${food.nutrients.fat}`);
}

function verifyFieldsInTableRow (food) {
  const $row = () => cy.get('[data-qa="health.components.dietTable"]').get('tbody').contains(food.name).parents('tr');
  $row().contains(food.serving.value);
  $row().contains(food.serving.unit);
  $row().contains(food.nutrients.calories);
  $row().contains(food.nutrients.carbs);
  $row().contains(food.nutrients.protein);
  $row().contains(food.nutrients.fat);
  cy.get('[data-qa="health.components.dietTable.icon.food"]').should('exist');
}
