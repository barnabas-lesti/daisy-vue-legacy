import mocks from '../../support/mocks';
import stubs from '../../support/stubs';

const user = mocks.getUser();

describe('Functional / Health / Diary', () => {
  beforeEach(() => {
    cy['auth/signIn'](user)
      .viewport('iphone-6');
  });

  it('Should have the appropriate title', () => {
    cy.visit('/diary');
    cy.title()
      .should('eq', 'Diary | Daisy');
    cy.get('.layout-navbar__title')
      .contains('Diary')
      .should('be.visible');
  });

  it('Should allow the user the CREATE a diary entry', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    stubs['diet/items'](user, { foods, recipes });
    stubs['diary'](user)
      .visit('/diary');

    const food1 = foods[0];
    const recipe1 = recipes[0];
    cy.get('.diary__fab')
      .should('be.visible')
      .click();
    cy.get('.diary__fab__open-select-modal')
      .click();
    cy.get('.diet-select-modal__table')
      .should('be.visible');
    cy.get('.diet-select-modal__table')
      .contains(food1.name)
      .click();
    cy.get('.diet-select-modal__table')
      .contains(recipe1.name)
      .click();
    cy.get('.common-modal__toolbar__confirm')
      .click();
    verifySummary(getNutrientSummary([ food1, recipe1 ]));

    const diaryItem1 = mocks.getDiaryItem(user.id, { items: [ food1, recipe1 ] });
    cy.server()
      .route({ method: 'PUT', url: '/api/diary', status: 200, response: diaryItem1, delay: 64 });
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__save')
      .click();
    cy.get('.layout-notifications')
      .contains(/diary.*saved/i)
      .should('be.visible');

    cy.viewport('macbook-13');

    const food2 = { ...foods[1], amount: mocks.randomFloat(2048) };
    const recipe2 = { ...recipes[1], amount: mocks.randomFloat(2048) };
    cy.get('.diary__open-select-modal')
      .should('be.visible')
      .click();
    changeAmountInModal(food2, food2.amount);
    changeAmountInModal(recipe2, recipe2.amount);
    cy.get('.common-modal__confirm')
      .click();
    verifySummary(getNutrientSummary([ food1, recipe1, food2, recipe2 ]));

    const diaryItem2 = mocks.getDiaryItem(user.id, { items: [ food1, recipe1, food2, recipe2 ] });
    cy.server()
      .route({ method: 'PATCH', url: '/api/diary/**', status: 200, response: diaryItem2, delay: 64 });
    cy.get('.diary__save')
      .click();
    cy.get('.layout-notifications')
      .contains(/diary.*saved/i)
      .should('be.visible');
  });

  it('Should allow the user to READ a diary entry', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const today = mocks.moment().format('YYYY-MM-DD');
    const dateString = mocks.moment(mocks.faker.date.future()).format('YYYY-MM-DD');
    const diaryItem = mocks.getDiaryItem(user.id, { dateString, items: [ foods[0], recipes[0] ] });
    stubs['diet/items'](user, { foods, recipes });
    stubs['diary'](user, [ diaryItem ])
      .visit('/');

    cy.get('.layout-navbar__toggle')
      .click();
    cy.get('.layout-sidebar-list-item--diary')
      .click()
      .should('have.class', 'v-list-item--active');
    cy.url()
      .should('include', `/diary/${today}`);
    cy.get('.diary__date-picker input')
      .should('have.value', today);

    cy['auth/signIn'](user);
    stubs['diet/items'](user, { foods, recipes });
    stubs['diary'](user, [ diaryItem ])
      .visit(`/diary/${dateString}`);
    cy.get('.diary__date-picker input')
      .should('have.value', dateString);
    verifySummary(getNutrientSummary([ foods[0], recipes[0] ]));
  });

  it('Should allow the user to UPDATE a diary entry', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const dateString = mocks.moment(mocks.faker.date.future()).format('YYYY-MM-DD');
    const food1 = foods[0];
    const recipe1 = recipes[0];
    const diaryItem1 = mocks.getDiaryItem(user.id, { dateString, items: [ food1, recipe1 ] });
    stubs['diet/items'](user, { foods, recipes });
    stubs['diary'](user, [ diaryItem1 ])
      .visit(`/diary/${dateString}`);

    const food2 = foods[1];
    const recipe2 = recipes[1];
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__open-select-modal')
      .click();
    cy.get('.diet-select-modal__table')
      .should('be.visible');
    cy.get('.diet-select-modal__table')
      .contains(food2.name)
      .click();
    cy.get('.diet-select-modal__table')
      .contains(recipe2.name)
      .click();
    cy.get('.common-modal__toolbar__confirm')
      .click();
    verifySummary(getNutrientSummary([ food1, recipe1, food2, recipe2 ]));

    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__remove')
      .click();
    cy.get('.diet-table')
      .contains(food2.name)
      .click();
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__remove')
      .click();
    verifySummary(getNutrientSummary([ food1, recipe1, recipe2 ]));

    changeAmount(cy.get('.diet-table'), recipe2, 0);
    verifySummary(getNutrientSummary([ food1, recipe1 ]));

    const diaryItem2 = { ...diaryItem1, items: [ food1, recipe1, { ...recipe2, amount: 0 } ] };
    cy.server()
      .route({ method: 'PATCH', url: '/api/diary/**', status: 200, response: diaryItem2, delay: 64 });
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__save')
      .click();
    cy.get('.layout-notifications')
      .contains(/diary.*saved/i)
      .should('be.visible');

    cy.viewport('macbook-13');

    const diaryItem3 = { ...diaryItem2, items: [ recipe1, { ...recipe2, amount: 0 } ] };
    cy.server()
      .route({ method: 'PATCH', url: '/api/diary/**', status: 200, response: diaryItem3, delay: 64 });
    cy.get('.diary__remove')
      .click();
    cy.get('.diet-table')
      .contains(food1.name)
      .click();
    cy.get('.diary__remove')
      .click();
    cy.get('.diary__save')
      .click();
    cy.get('.layout-notifications')
      .contains(/diary.*saved/i)
      .should('be.visible');
    verifySummary(getNutrientSummary([ recipe1 ]));
  });
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
    .contains(`${formatValue(carbs / total * 100)} %`)
    .should('be.visible');
  cy.get('@summary')
    .contains(`${formatValue(protein / total * 100)} %`)
    .should('be.visible');
  cy.get('@summary')
    .contains(`${formatValue(fat / total * 100)} %`)
    .should('be.visible');
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
  return changeAmount(cy.get('.diet-select-modal__table'), item, value);
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
