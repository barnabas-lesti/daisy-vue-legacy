import mocks from '../../../../support/mocks';
import stubs from '../../../../support/stubs';

const user = mocks.user();

describe('Functional / Health / Diet', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Page is accessible from the sidebar', () => {
    cy['core/signIn'](user);
    stubs['health/dietItems'](user)
      .visit('/');

    cy['core/signIn'](user)
      .visit('/');
    cy.get('.navbar__toggle')
      .click();
    cy.get('.list-group--health')
      .click()
      .should('have.class', 'v-list-group--active');
    cy.get('.list-item--health-diet')
      .click()
      .should('have.class', 'v-list-item--active');
    cy.url()
      .should('include', '/health/diet');
  });

  it('Should allow filtering on the table items', () => {
    const foods = mocks.foods(user.id);
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods })
      .visit('/health/diet');

    cy.get('.diet__search')
      .type(foods[0].name);
    cy.get('.diet .diet-table tbody').as('table')
      .contains(foods[0].name).should('be.visible');
    cy.get('@table')
      .contains(foods[1].name).should('not.be.visible');
  });

  it('User should be able to filter the item result', () => {
    const foods = mocks.foods(user.id);
    const recipes = mocks.recipes(user.id, foods);
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods, recipes })
      .visit('/health/diet');
    cy.get('.diet-table__filters')
      .click();

    cy.get('.diet .diet-table').find('.v-icon[data-item-type="Food"]').as('foodIcons')
      .should('have.length', foods.length);
    cy.get('.diet .diet-table').find('.v-icon[data-item-type="Recipe"]').as('recipeIcons')
      .should('have.length', recipes.length);

    cy.get('.diet-table__filters__show-foods')
      .click();
    cy.get('@foodIcons')
      .should('have.length', 0);
    cy.get('.diet-table__filters__show-recipes')
      .click();
    cy.get('@recipeIcons')
      .should('have.length', 0);
  });
});
