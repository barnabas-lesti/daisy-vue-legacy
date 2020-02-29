import mocks from '../../../support/mocks';
import stubs from '../../../support/stubs';

const user = mocks.user();

describe('Functional / Health / Calculator', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Page is accessible from the sidebar', () => {
    cy['core/signIn'](user);
    stubs['health/dietItems'](user);
    stubs['health/diary'](user)
      .visit('/');

    cy['core/signIn'](user)
      .visit('/');
    cy.get('.navbar__toggle')
      .click();
    cy.get('.list-group--health')
      .click();
    // .should('have.class', 'v-list-group--active');
    cy.get('.list-item--health-diary')
      .click();
    // .should('have.class', 'v-list-item--active');
    cy.url()
      .should('include', '/health/diary');
  });

  it('User should be able to add items to the calculator', () => {
    const foods = mocks.foods(user.id);
    const recipes = mocks.recipes(user.id, foods);
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods, recipes });
    stubs['health/diary'](user)
      .visit('/health/diary');

    cy.get('.nutrients-chart')
      .should('not.be.visible');

    const food1 = foods[0];
    const recipe1 = recipes[0];
    cy.get('.diary__fab')
      .should('be.visible')
      .click();
    cy.get('.diary__fab__open-select-modal')
      .click();
    cy.get('.select-modal__table').as('selectTable')
      .should('be.visible');
    cy.get('@selectTable').contains(food1.name)
      .click();
    cy.get('@selectTable').contains(recipe1.name)
      .click();
    cy.get('.modal__toolbar__confirm')
      .click();
    verifySummary(getNutrientSummary([ food1, recipe1 ]));

    const food2 = { ...foods[1], amount: mocks.randomFloat(2048) };
    const recipe2 = { ...recipes[1], amount: mocks.randomFloat(2048) };
    cy.viewport('macbook-13');
    cy.get('.diary__open-select-modal')
      .should('be.visible')
      .click();
    changeAmountInModal(food2, food2.amount);
    changeAmountInModal(recipe2, recipe2.amount);
    cy.get('.modal__confirm')
      .click();
    verifySummary(getNutrientSummary([ food1, recipe1, food2, recipe2 ]));
  });

  it('TODO: Fix and write more tests');

  // it('User should be able view/edit/remove items', () => {
  //   const foods = mocks.foods(user.id);
  //   const recipes = mocks.recipes(user.id, foods);
  //   const food1 = foods[0];
  //   const recipe1 = recipes[0];
  //   cy['core/signIn'](user);
  //   stubs['health/dietItems'](user, { foods, recipes });
  //   stubs['health/diary'](user, [ food1, recipe1 ])
  //     .visit('/health/diary');

  //   cy.get('.diary__fab')
  //     .click();
  //   cy.get('.diary__fab__open-select-modal')
  //     .click();
  //   cy.get('.select-modal__table').as('selectTable').contains(food1.name)
  //     .click();
  //   cy.get('@selectTable').contains(recipe1.name)
  //     .click();
  //   cy.get('.modal__toolbar__confirm')
  //     .click();

  //   cy.get('.diary__table')
  //     .contains(food1.name).click();
  //   cy.url()
  //     .should('include', `selected=${food1.id}`);
  //   cy.get('.modal__toolbar__edit')
  //     .click();
  //   cy.url()
  //     .should('match', new RegExp(`health/diet\\?selected=${food1.id}&referer=.*`, 'i'));
  //   cy.get('.modal__toolbar__cancel')
  //     .click();
  //   cy.url()
  //     .should('match', new RegExp(`health/calculator\\?selected=${food1.id}`, 'i'));
  //   cy.get('.modal__toolbar__remove')
  //     .click();
  //   cy.get('.modal__confirm-remove__confirm')
  //     .click();
  //   verifySummary(getNutrientSummary([ recipe1 ]));

  //   cy.viewport('macbook-13');
  //   cy.get('.calculator__change-items')
  //     .click();
  //   cy.get('@selectTable').contains(recipe1.name)
  //     .click();
  //   cy.get('.modal__confirm')
  //     .click();
  //   cy.get('.nutrients-chart')
  //     .should('not.be.visible');
  // });

  // it('Items added should be preserved and displayed after page reload/navigation', () => {
  //   const foods = mocks.foods(user.id);
  //   const recipes = mocks.recipes(user.id, foods);
  //   cy['core/signIn'](user);
  //   stubs['health/dietItems'](user, { foods, recipes })
  //     .visit('/health/calculator');

  //   const food = foods[0];
  //   const recipe = recipes[0];
  //   cy.get('.calculator__fab')
  //     .click();
  //   cy.get('.select-modal__table').as('selectTable').contains(food.name)
  //     .click();
  //   cy.get('@selectTable').contains(recipe.name)
  //     .click();
  //   cy.get('.modal__toolbar__confirm')
  //     .click();

  //   cy['core/signIn'](user);
  //   cy.reload();
  //   verifySummary(getNutrientSummary([ food, recipe ]));

  //   food.amount = mocks.randomFloat(2048);
  //   recipe.amount = mocks.randomFloat(2048);
  //   changeAmountInTable(food, food.amount);
  //   changeAmountInTable(recipe, recipe.amount);
  //   verifySummary(getNutrientSummary([ food, recipe ]));
  // });
});

function verifySummary (summary) {
  const { calories, carbs, protein, fat } = summary;
  cy.get('.diary__summary').as('summary')
    .scrollIntoView()
    .contains(formatValue(calories)).should('be.visible');
  cy.get('@summary')
    .contains(formatValue(carbs)).should('be.visible');
  cy.get('@summary')
    .contains(formatValue(protein)).should('be.visible');
  cy.get('@summary')
    .contains(formatValue(fat)).should('be.visible');

  const total = carbs + protein + fat;
  cy.get('@summary')
    .contains(`${formatValue(carbs / total * 100)} %`).should('be.visible');
  cy.get('@summary')
    .contains(`${formatValue(protein / total * 100)} %`).should('be.visible');
  cy.get('@summary')
    .contains(`${formatValue(fat / total * 100)} %`).should('be.visible');
}

function formatValue (nutrient) {
  return parseFloat(nutrient).toFixed(2);
}

function getNutrientSummary (items) {
  return items
    .map(item => mocks.convertToDietItem(item))
    .reduce((summary, nextItem) => {
      const multiplier = nextItem.amount / nextItem.serving.value;
      const { calories, carbs, protein, fat } = nextItem.getNutrients();
      summary.calories += calories * multiplier;
      summary.carbs += carbs * multiplier;
      summary.protein += protein * multiplier;
      summary.fat += fat * multiplier;
      return summary;
    }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
}

function changeAmountInModal (item, value) {
  return changeAmount(cy.get('.select-modal__table'), item, value);
}

function changeAmountInTable (item, value) {
  return changeAmount(cy.get('.calculator__table'), item, value);
}

function changeAmount (source, item, value) {
  source
    .contains(item.name).parents('tr').find('.diet-table__table__amount-display')
    .scrollIntoView()
    .click();
  return cy.get(`input[name="amount"][data-id="${item.id}"]`)
    .scrollIntoView()
    .clear().type(`${value}{enter}`);
}
