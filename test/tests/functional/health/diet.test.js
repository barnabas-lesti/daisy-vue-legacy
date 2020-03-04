import mocks from '../../../support/mocks';
import stubs from '../../../support/stubs';

const user = mocks.getUser();

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
      .should('include', '/health/food-and-recipes');
  });

  it('Should allow filtering on the table items', () => {
    const foods = mocks.getFoods(user.id);
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods })
      .visit('/health/food-and-recipes');

    cy.get('.diet-table-filters__search')
      .type(foods[0].name);
    cy.get('.diet .diet-table tbody').as('table')
      .contains(foods[0].name).should('be.visible');
    cy.get('@table')
      .contains(foods[1].name).should('not.be.visible');
  });
});
