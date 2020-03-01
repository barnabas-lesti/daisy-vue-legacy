import mocks from '../../../../support/mocks';
import stubs from '../../../../support/stubs';

const user = mocks.user();

describe('Functional / Health / Diet / Food', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Food modal should be accessible for the user', () => {
    const foods = mocks.foods(user.id);
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods })
      .visit('/health/food-and-recipes');

    cy.get('.diet__fab')
      .click();
    cy.get('.diet__fab__new-food')
      .click();
    cy.url()
      .should('include', 'selected=new-food');
    cy.get('.food-modal__form').as('form')
      .should('be.visible');

    cy.get('.modal__toolbar__cancel').as('toolbarCancel')
      .click();
    cy.url()
      .should('not.include', 'selected=new-food');
    cy.get('@form')
      .should('not.be.visible');

    cy.get('.diet .diet-table tbody').as('table')
      .contains(foods[0].name).click();
    cy.url()
      .should('include', `selected=${foods[0].id}`);
    cy.get('.modal__toolbar__remove')
      .should('be.visible');
    cy.get('.modal__toolbar__confirm')
      .should('be.visible');
    cy.get('@toolbarCancel')
      .click();

    cy.viewport('macbook-13');
    cy.get('.diet__new-food')
      .click();
    cy.url()
      .should('include', 'selected=new-food');
    cy.get('@form')
      .should('be.visible');
    cy.get('.modal__cancel').as('cancel')
      .click();
    cy.url()
      .should('not.include', 'selected=new-food');
    cy.get('@form')
      .should('not.be.visible');

    cy.get('@table')
      .contains(foods[0].name).click();
    cy.get('.modal__remove')
      .should('be.visible');
    cy.get('.modal__confirm')
      .should('be.visible');
    cy.get('@cancel')
      .click();
  });

  it('Should allow the creation of new food', () => {
    const food = mocks.food(user.id);
    cy['core/signIn'](user);
    stubs['health/dietItems'](user)
      .visit('/health/food-and-recipes?selected=new-food');

    cy.get('.food-modal__form').as('form')
      .submit()
      .contains(/name.*required/i).should('be.visible');
    fillForm(food);

    cy.server()
      .route({ method: 'PUT', url: '/api/health/diet/foods', status: 200, response: food, delay: 64 });
    cy.get('.food-modal__form')
      .submit();
    cy.get('.modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.notifications')
      .contains(/food.*saved/i).should('be.visible');
    verifyInTable(food);
  });

  it('Should allow the modification of existing food', () => {
    const foods = mocks.foods(user.id);
    const existingFood = foods[0];
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods })
      .visit('/health/food-and-recipes');

    cy.get('.diet .diet-table tbody').contains(existingFood.name)
      .click();
    verifyInForm(existingFood);

    const update = { ...mocks.food(user.id), id: existingFood.id };
    cy.server()
      .route({ method: 'PATCH', url: `/api/health/diet/foods/${update.id}`, status: 200, response: update, delay: 64 });
    fillForm(update, { clear: true });
    cy.get('.food-modal__form').as('form')
      .submit();
    cy.get('.modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.notifications')
      .contains(/food.*saved/i).should('be.visible');
    verifyInTable(update);
  });

  it('Should allow the removal of existing food', () => {
    const foods = mocks.foods(user.id);
    const food = foods[0];
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods })
      .visit(`/health/food-and-recipes?selected=${food.id}`);

    cy.get('.modal__toolbar__remove')
      .click();
    cy.get('.modal__confirm-remove')
      .should('be.visible');
    cy.get('.modal__confirm-remove__cancel')
      .click();
    cy.get('.modal__toolbar__cancel')
      .click();
    verifyInTable(food);

    cy.server()
      .route({ method: 'DELETE', url: `/api/health/diet/foods/${food.id}`, status: 200, response: '', delay: 64 });
    cy.get('.diet .diet-table tbody').as('table')
      .contains(food.name)
      .click();
    cy.get('.modal__toolbar__remove')
      .click();
    cy.get('.modal__confirm-remove__confirm')
      .click();
    cy.get('.modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.notifications')
      .contains(/food.*deleted/i).should('be.visible');
    cy.get('@table')
      .contains(food.name).should('not.be.visible');
  });
});

function fillForm (food, { clear = false } = {}) {
  const clearWrapper = ($el) => clear ? $el.clear() : $el;
  clearWrapper(cy.get('input[name="name"]'))
    .type(food.name);
  clearWrapper(cy.get('input[name="description"]'))
    .type(food.description);
  clearWrapper(cy.get('input[name="servingValue"]'))
    .type(food.serving.value);
  cy.get('.food-modal__form__serving__unit .v-select__slot')
    .click()
    .get('.v-select-list').contains(food.serving.unit)
    .click();
  clearWrapper(cy.get('input[name="calories"]'))
    .type(food.nutrients.calories);
  clearWrapper(cy.get('input[name="carbs"]'))
    .type(food.nutrients.carbs);
  clearWrapper(cy.get('input[name="protein"]'))
    .type(food.nutrients.protein);
  return clearWrapper(cy.get('input[name="fat"]'))
    .type(food.nutrients.fat);
}

function verifyInTable (food) {
  cy.get('.diet .diet-table tbody').contains(food.name).parents('tr').as('row')
    .find('.v-icon[data-item-type="Food"]').should('be.visible');
  cy.get('@row')
    .contains(food.serving.value).should('be.visible');
  cy.get('@row')
    .contains(food.nutrients.calories).should('be.visible');
  cy.get('@row')
    .contains(food.nutrients.carbs).should('be.visible');
  cy.get('@row')
    .contains(food.nutrients.protein).should('be.visible');
  return cy.get('@row')
    .contains(food.nutrients.fat).should('be.visible');
}

function verifyInForm (food) {
  cy.get('input[name="name"]')
    .should('have.value', food.name);
  cy.get('input[name="description"]')
    .should('have.value', food.description);
  cy.get('input[name="servingValue"]')
    .should('have.value', `${food.serving.value}`);
  cy.get('input[name="servingUnit"]')
    .should('have.value', `${food.serving.unit}`);
  cy.get('input[name="calories"]')
    .should('have.value', `${food.nutrients.calories}`);
  cy.get('input[name="carbs"]')
    .should('have.value', `${food.nutrients.carbs}`);
  cy.get('input[name="protein"]')
    .should('have.value', `${food.nutrients.protein}`);
  return cy.get('input[name="fat"]')
    .should('have.value', `${food.nutrients.fat}`);
}
