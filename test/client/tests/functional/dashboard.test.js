import mocks from '../../support/mocks';
import stubs from '../../support/stubs';

const user = mocks.getUser();

describe('Functional / Core / Dashboard', () => {
  beforeEach(() => {
    cy['auth/signIn'](user)
      .viewport('iphone-6');
  });

  it('Should have the appropriate title', () => {
    cy.visit('/');
    cy.title()
      .should('eq', 'Dashboard | Daisy');
    cy.get('.layout-navbar__title')
      .contains('Dashboard')
      .should('be.visible');
  });

  it('Should allow the user to view widgets', () => {
    const foods = mocks.getFoods(user.id, 10);
    const recipes = mocks.getRecipes(user.id, foods, 10);
    const diaryItems = mocks.getDiaryItems(user.id, { numberOfItems: 10, dietItems: { foods, recipes } });
    stubs['diet/items'](user, { foods, recipes });
    stubs['diary'](user, diaryItems)
      .visit('/');

    cy.wait(300)
      .screenshot();

    cy.viewport('macbook-13');
    cy.wait(300)
      .screenshot();
  });
});
