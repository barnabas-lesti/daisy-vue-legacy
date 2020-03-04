import mocks from '../../../support/mocks';
import stubs from '../../../support/stubs';

const user = mocks.getUser();

describe('Functional / Core / Dashboard', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should allow the user to view widgets', () => {
    const foods = mocks.getFoods(user.id, 10);
    const recipes = mocks.getRecipes(user.id, foods, 10);
    const diaryItems = mocks.getDiaryItems(user.id, { numberOfItems: 10, dietItems: { foods, recipes } });
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods, recipes });
    stubs['health/diary'](user, diaryItems)
      .visit('/');

    // cy.get('.nutrient-summary-widget');
    cy.wait(400)
      .screenshot();
  });
});
