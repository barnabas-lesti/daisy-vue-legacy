import http from '../../../plugins/http';

export default {
  async 'diet/foods/fetch' (context) {
    const foods = await http.get('/api/diet/foods');
    context.commit('diet/foods/set', { foods, setLoaded: true });
  },
  async 'diet/food/save' (context, food) {
    if (food.id) {
      const updatedFood = await http.patch(`/api/diet/foods/${food.id}`, food);
      context.commit('diet/food/update', updatedFood);
    } else {
      const createdFood = await http.put('/api/diet/foods', food);
      context.commit('diet/food/add', createdFood);
    }
  },
  async 'diet/food/remove' (context, food) {
    await http.delete(`/api/diet/foods/${food.id}`);
    context.commit('diet/food/remove', food);
  },

  async 'diet/recipes/fetch' (context) {
    const recipes = await http.get('/api/diet/recipes');
    context.commit('diet/recipes/set', { recipes, setLoaded: true });
  },
  async 'diet/recipe/save' (context, recipe) {
    if (recipe.id) {
      await http.patch(`/api/diet/recipes/${recipe.id}`, recipe);
      context.commit('diet/recipe/update', recipe);
    } else {
      const { id } = await http.put('/api/diet/recipes', recipe);
      context.commit('diet/recipe/add', { ...recipe, id });
    }
  },
  async 'diet/recipe/remove' (context, recipe) {
    await http.delete(`/api/diet/recipes/${recipe.id}`);
    context.commit('diet/recipe/remove', recipe);
  },

  async 'diet/items/fetch' (context) {
    await Promise.all([
      context.dispatch('diet/foods/fetch'),
      context.dispatch('diet/recipes/fetch'),
    ]);
  },
  async 'diet/items/ensure' (context) {
    const dietItems = context.getters['diet/items'];
    if (dietItems) return;
    await context.dispatch('diet/items/fetch');
  },
};
