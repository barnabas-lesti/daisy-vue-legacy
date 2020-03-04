import mocks from './mocks';

export default {
  'core/user' (user) {
    user = user || mocks.user();
    return cy.server()
      .route({ method: 'GET', url: '/api/auth/profile', status: 200, response: user });
  },
  'health/dietItems' (user, { foods, recipes } = {}) {
    foods = foods || mocks.foods(user.id);
    recipes = recipes || mocks.recipes(user.id, foods);
    return cy.server()
      .route({ method: 'GET', url: '/api/health/diet/foods', status: 200, response: foods })
      .route({ method: 'GET', url: '/api/health/diet/recipes', status: 200, response: recipes });
  },
  'health/diary' (user, diaryItem) {
    const response = diaryItem ? [ diaryItem ] : [];
    return cy.server()
      .route({ method: 'GET', url: '/api/health/diary**', status: 200, response });
  },
};
