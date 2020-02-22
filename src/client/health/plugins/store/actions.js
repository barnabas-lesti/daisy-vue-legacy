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
      const createdFood = await http.put('/api/health/diet/food', food);
      context.commit('diet/addFood', createdFood);
    }
  },
  async 'diet/removeFood' (context, food) {
    await http.delete(`/api/health/diet/food/${food.id}`);
    context.commit('diet/removeFood', food);
  },

  async 'diet/fetchRecipes' (context) {
    const recipes = await http.get('/api/health/diet/recipes');
    context.commit('diet/setRecipes', recipes);
  },
  async 'diet/saveRecipe' (context, recipe) {
    if (recipe.id) {
      await http.patch(`/api/health/diet/recipes/${recipe.id}`, convertRecipeToPayload(recipe));
      context.commit('diet/updateRecipe', recipe);
    } else {
      const { id } = await http.put('/api/health/diet/recipes', convertRecipeToPayload(recipe));
      context.commit('diet/addRecipe', { ...recipe, id });
    }
  },
  async 'diet/removeRecipe' (context, recipe) {
    await http.delete(`/api/health/diet/recipes/${recipe.id}`);
    context.commit('diet/removeRecipe', recipe);
  },

  async 'diet/fetchItems' (context) {
    await Promise.all([
      context.dispatch('diet/fetchFood'),
      context.dispatch('diet/fetchRecipes'),
    ]);
  },

  'calculator/setItems' (context, items) {
    context.commit('calculator/setItems', items);
  },
};

function convertRecipeToPayload (recipe) {
  const payload = Object.assign({}, recipe);
  const ingredients = [...recipe.ingredients];
  payload.ingredients = ingredients.map(item => {
    const itemClone = Object.assign({}, item);
    itemClone.food = item.food.id;
    return itemClone;
  });
  return payload;
}
