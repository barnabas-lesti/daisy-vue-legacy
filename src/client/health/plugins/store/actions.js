import http from '../../../core/plugins/http';

export default {
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
};
