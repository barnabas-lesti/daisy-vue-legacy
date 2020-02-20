import { http, store } from '../core/plugins';

import { Food, Recipe } from './models';

store.registerModule('health', {
  namespaced: true,

  state: {
    diet: {
      food: [],
      recipes: [],
    },

    calculator: {
      items: [],
    },
  },
  mutations: {
    'diet/setFood' (state, food = []) {
      state.diet.food = food.map(item => new Food(item));
    },
    'diet/updateFood' (state, update) {
      const food = state.diet.food.splice(0);
      for (let i = 0; i < food.length; i++) {
        if (food[i].id === update.id) {
          food[i] = new Food(update);
          break;
        }
      }
      state.diet.food = food;
    },
    'diet/addFood' (state, food) {
      state.diet.food.push(new Food(food));
    },
    'diet/removeFood' (state, food) {
      state.diet.food = state.diet.food.splice(0).filter(item => item.id !== food.id);
    },

    'diet/setRecipes' (state, recipes = []) {
      state.diet.recipes = recipes.map(item => new Recipe(item));
    },

    'calculator/setItems' (state, items) {
      state.calculator.items = items.splice(0);
    },
  },
  actions: {
    async 'diet/fetchFood' (context) {
      const food = await http.get('/api/health/diet/food');
      context.commit('diet/setFood', food);
    },
    async 'diet/saveFood' (context, food) {
      if (food.id) {
        const updatedFood = await http.patch(`/api/health/diet/food/${food.id}`, food);
        context.commit('diet/updateFood', updatedFood);
      } else {
        const createdFood = await http.put('/api/health/diet/food/', food);
        context.commit('diet/addFood', createdFood);
      }
    },
    async 'diet/removeFood' (context, food) {
      await http.delete(`/api/health/diet/food/${food.id}`);
      context.commit('diet/removeFood', food);
    },

    async 'diet/fetchRecipes' (context) {
      // TODO: Uncomment when API is ready
      // const recipes = await http.get('/api/health/diet/recipes');
      // context.commit('diet/setRecipes', recipes);
    },

    'calculator/setItems' (context, items) {
      context.commit('calculator/setItems', items);
    },
  },
});
