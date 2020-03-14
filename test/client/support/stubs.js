import mocks from './mocks';

export default {
  'auth/user' (user) {
    user = user || mocks.getUser();
    return cy.server()
      .route({ method: 'GET', url: '/api/auth/profile', status: 200, response: user });
  },
  'diet/items' (user, { foods, recipes } = {}) {
    foods = foods || mocks.getFoods(user.id);
    recipes = recipes || mocks.getRecipes(user.id, foods);
    return cy.server()
      .route({ method: 'GET', url: '/api/diet/foods', status: 200, response: foods })
      .route({ method: 'GET', url: '/api/diet/recipes', status: 200, response: recipes });
  },
  'diary' (user, diaryItem = []) {
    return cy.server()
      .route({ method: 'GET', url: '/api/diary**', status: 200, response: diaryItem });
  },
};
