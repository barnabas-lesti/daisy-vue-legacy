import mocks from './mocks';

export default {
  'core/user' (user) {
    user = user || mocks.getUser();
    return cy.server()
      .route({ method: 'GET', url: '/api/auth/profile', status: 200, response: user });
  },
  'health/dietItems' (user, { foods, recipes } = {}) {
    foods = foods || mocks.getFoods(user.id);
    recipes = recipes || mocks.getRecipes(user.id, foods);
    return cy.server()
      .route({ method: 'GET', url: '/api/health/diet/foods', status: 200, response: foods })
      .route({ method: 'GET', url: '/api/health/diet/recipes', status: 200, response: recipes });
  },
  'health/diary' (user, diaryItem = []) {
    return cy.server()
      .route({ method: 'GET', url: '/api/health/diary**', status: 200, response: diaryItem });
  },
};
