const data = require('../../../data');

let foodArray;

const $fab = () => cy.get('[data-qa="health.diet.fab"]');
const $fabCreateFood = () => cy.get('[data-qa="health.diet.fab.food.create"]');

const $search = () => cy.get('[data-qa="health.diet.search"]');

const $createButton = () => cy.get('[data-qa="health.diet.food.create"]');
const $form = () => cy.get('[data-qa="health.diet.food.form"]');
const $name = () => cy.get('[data-qa="health.diet.food.form.name"]');
const $description = () => cy.get('[data-qa="health.diet.food.form.description"]');
const $servingUnit = () => cy.get('[data-qa="health.diet.food.form.serving.unit"]');
const $servingValue = () => cy.get('[data-qa="health.diet.food.form.serving.value"]');
const $calories = () => cy.get('[data-qa="health.diet.food.form.calories"]');
const $carbs = () => cy.get('[data-qa="health.diet.food.form.carbs"]');
const $protein = () => cy.get('[data-qa="health.diet.food.form.protein"]');
const $fat = () => cy.get('[data-qa="health.diet.food.form.fat"]');

const $selectList = () => cy.get('.v-select-list');

const $modalContent = () => cy.get('[data-qa="modal.content"]');
const $modalDesktopConfirm = () => cy.get('[data-qa="modal.desktop.confirm"]');
const $modalDesktopCancel = () => cy.get('[data-qa="modal.desktop.cancel"]');
const $modalDesktopRemove = () => cy.get('[data-qa="modal.desktop.remove"]');
const $modalMobileConfirm = () => cy.get('[data-qa="modal.mobile.confirm"]');
const $modalMobileCancel = () => cy.get('[data-qa="modal.mobile.cancel"]');
const $modalMobileRemove = () => cy.get('[data-qa="modal.mobile.remove"]');
const $modalRemoveConfirm = () => cy.get('[data-qa="modal.remove.confirm"]');
const $modalRemoveCancel = () => cy.get('[data-qa="modal.remove.cancel"]');

const $table = () => cy.get('[data-qa="health.diet.table"]');
const $tableBody = () => $table().get('tbody');
const $typeIcon = (type) => cy.get(`[data-qa="health.diet.table.icon.${type}"]`);

const $navbarSidebarToggle = () => cy.get('[data-qa="navbar.sidebarToggle"]');
const $sidebarHealthLink = () => cy.get('[data-qa="sidebar.health.link"]');
const $sidebarDietLink = () => cy.get('[data-qa="sidebar.health.diet.link"]');

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

    const food = data.health.generateFood();
    cy.visit('/health/diet');

    $createButton().click();
    $form().should('be.visible');
    $form().submit();
    $form().contains(/name.*required/i).should('be.visible');

    fillInForm(food);
    $modalDesktopConfirm().should('be.visible').click();
    $form().should('not.be.visible');

    $tableBody().find('tr').eq(0).click();
    verifyFieldsInForm(food);
    $modalDesktopCancel().click();
    $form().should('not.be.visible');
  });

  it('Should create a food item (Mobile)', () => {
    cy['auth/signIn']();

    const food = data.health.generateFood();
    cy.viewport('iphone-6');
    cy.visit('/health/diet');

    $fab().click();
    $fabCreateFood().should('be.visible').click();
    $form().should('be.visible');
    $form().submit();
    $form().contains(/name.*required/i).should('be.visible');

    fillInForm(food);
    $modalMobileConfirm().click();
    $modalContent().should('not.be.visible');
    $tableBody().contains(food.name).click();
    verifyFieldsInForm(food);
    $modalMobileCancel().click();
    $modalContent().should('not.be.visible');
  });

  it('Should update a food item', () => {
    cy['auth/signIn']();
    prepareFood();

    const food = foodArray[0];
    const update = data.health.generateFood();
    cy.visit('/health/diet');

    verifyFieldsInTableRow(food);
    $tableBody().contains(food.name).click();
    fillInForm(update);
    $form().submit();

    cy.reload();
    $search().type(food.name);
    $tableBody().contains(food.name).should('not.exist');
    $search().clear().type(update.name);
    verifyFieldsInTableRow(update);
  });

  it('Should delete a food item (Desktop)', () => {
    cy['auth/signIn']();
    prepareFood();

    const food = foodArray[0];
    cy.visit('/health/diet');

    $tableBody().contains(food.name).click();
    $modalDesktopRemove().click();
    $modalRemoveCancel().click();
    $modalDesktopCancel().click();
    $tableBody().contains(food.name).should('exist');

    $tableBody().contains(food.name).click();
    $modalDesktopRemove().click();
    $modalRemoveConfirm().click();
    cy.reload();
    $tableBody().contains(food.name).should('not.exist');
  });

  it('Should delete a food item (Mobile)', () => {
    cy['auth/signIn']();
    cy.viewport('iphone-6');
    prepareFood();

    const food = foodArray[0];
    cy.visit('/health/diet');

    $tableBody().contains(food.name).click();
    $modalMobileRemove().click();
    $modalRemoveCancel().click();
    $modalMobileCancel().click();
    $tableBody().contains(food.name).should('exist');

    $tableBody().contains(food.name).click();
    $modalMobileRemove().click();
    $modalRemoveConfirm().click();
    cy.reload();
    $tableBody().contains(food.name).should('not.exist');
  });
});

function navigateToDiet () {
  cy.visit('/');

  $navbarSidebarToggle().click();
  $sidebarHealthLink().click();
  $sidebarDietLink().should('be.visible').click();
  cy.url().should('include', '/health/diet');
}

function prepareFood (numberOfItems = 5) {
  foodArray = Array.from(Array(numberOfItems), () => data.health.generateFood());
  return cy['health/diet/createFood'](foodArray);
}

function fillInForm (food) {
  $name().clear().type(food.name);
  $description().clear().type(food.description);
  $servingUnit().click();
  $selectList().contains(food.serving.unit).click();
  $servingValue().clear().type(food.serving.value);
  $calories().clear().type(food.nutrition.calories);
  $carbs().clear().type(food.nutrition.carbs);
  $protein().clear().type(food.nutrition.protein);
  $fat().clear().type(food.nutrition.fat);
}

function verifyFieldsInForm (food) {
  $name().invoke('val').should('eq', food.name);
  $description().invoke('val').should('eq', food.description);
  $servingUnit().get('[name="servingUnit"]').invoke('val').should('eq', food.serving.unit);
  $servingValue().invoke('val').should('eq', `${food.serving.value}`);
  $calories().invoke('val').should('eq', `${food.nutrition.calories}`);
  $carbs().invoke('val').should('eq', `${food.nutrition.carbs}`);
  $protein().invoke('val').should('eq', `${food.nutrition.protein}`);
  $fat().invoke('val').should('eq', `${food.nutrition.fat}`);
}

function verifyFieldsInTableRow (food) {
  const $row = () => $tableBody().contains(food.name).parent('tr');
  $row().contains(food.serving.value);
  $row().contains(food.serving.unit);
  $row().contains(food.nutrition.calories);
  $row().contains(food.nutrition.carbs);
  $row().contains(food.nutrition.protein);
  $row().contains(food.nutrition.fat);
  $typeIcon('food').should('exist');
}
