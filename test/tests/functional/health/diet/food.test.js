import mocks from '../../../../support/mocks';

const user = mocks.user();

describe('Functional / Health / Diet / Food', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  // it('Page is accessible from the sidebar', () => {
  //   cy['core/signIn'](user)
  //     .visit('/');

  //   cy['core/signIn'](user)
  //     .visit('/');
  //   cy.get('.navbar__toggle')
  //     .click();
  //   cy.get('.sidebar-list-group--health')
  //     .click()
  //     .should('have.class', 'v-list-group--active');
  //   cy.get('.sidebar-list-item--health-diet')
  //     .click()
  //     .should('have.class', 'v-list-item--active');
  //   cy.url()
  //     .should('include', '/health/diet');
  // });

  // it('Should allow the food modal to be user', () => {
  //   cy['core/signIn'](user);
  //   cy.server()
  //     .route({ method: 'GET', url: '/api/health/diet/food', status: 200, response: [] })
  //     .route({ method: 'GET', url: '/api/health/diet/recipes', status: 200, response: [] })
  //     .visit('/health/diet');

  //   cy.get('.diet__fab')
  //     .click();
  //   cy.get('.diet__fab__new-food')
  //     .click();
  //   cy.url()
  //     .should('include', 'selected=new-food');
  //   cy.get('.food-modal__form').as('form')
  //     .should('be.visible');
  //   cy.get('.modal__toolbar__cancel')
  //     .click();
  //   cy.url()
  //     .should('not.include', 'selected=new-food');
  //   cy.get('@form')
  //     .should('not.be.visible');

  //   cy.viewport('macbook-13');
  //   cy.get('.diet__new-food')
  //     .click();
  //   cy.url()
  //     .should('include', 'selected=new-food');
  //   cy.get('@form')
  //     .should('be.visible');
  //   cy.get('.modal__cancel')
  //     .click();
  //   cy.url()
  //     .should('not.include', 'selected=new-food');
  //   cy.get('@form')
  //     .should('not.be.visible');
  // });

  // it('Should allow the creation of new food', () => {
  //   const food = mocks.oneFood(user.id);
  //   cy['core/signIn'](user);
  //   cy.server()
  //     .route({ method: 'GET', url: '/api/health/diet/food', status: 200, response: [] })
  //     .route({ method: 'GET', url: '/api/health/diet/recipes', status: 200, response: [] })
  //     .visit('/health/diet?selected=new-food');

  //   cy.get('.food-modal__form').as('form')
  //     .submit()
  //     .contains(/name.*required/i).should('be.visible');
  //   fillForm(food);

  //   cy.server()
  //     .route({ method: 'PUT', url: '/api/health/diet/food', status: 200, response: food, delay: 64 });
  //   cy.get('.modal__toolbar__confirm')
  //     .click()
  //     .should('have.class', 'v-btn--loading');
  //   cy.get('.notifications')
  //     .contains(/food.*saved/i).should('be.visible');
  //   cy.url()
  //     .should('not.include', 'selected');
  //   verifyInTable(food);
  // });

  it('Should allow the modification of existing food', () => {
    const food = mocks.oneFood(user.id);
    cy['core/signIn'](user);
    cy.server()
      .route({ method: 'GET', url: '/api/health/diet/food', status: 200, response: [ food ] })
      .route({ method: 'GET', url: '/api/health/diet/recipes', status: 200, response: [] })
      .visit('/health/diet');

    cy.get('.diet .diet-table tbody').contains(food.name)
      .click();
    cy.url()
      .should('include', `selected=${food.id}`);
    verifyInForm(food);
  });

  // it('Should allow the removal of existing food', () => {});

  // it('Should display food in the table', () => {});

  // it('Should allow filtering on the table items', () => {});
});

function fillForm (food, { clear = false } = {}) {
  const clearWrapper = ($el) => clear ? $el.clear() : $el;
  clearWrapper(cy.get('input[name="name"]'))
    .type(food.name);
  clearWrapper(cy.get('input[name="description"]'))
    .type(food.description);
  clearWrapper(cy.get('input[name="servingValue"]'))
    .type(food.serving.value);
  cy.get('.food-modal__serving__unit .v-select__slot')
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
    .find('.v-icon[data-type="food"]').should('be.visible');
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
