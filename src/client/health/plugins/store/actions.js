import http from '../../../core/plugins/http';

export default {
  async 'diet/fetchFoods' (context) {
    const foods = await http.get('/api/health/diet/foods');
    context.commit('diet/setFoods', { foods, setLoaded: true });
  },
  async 'diet/saveFood' (context, food) {
    if (food.id) {
      const updatedFood = await http.patch(`/api/health/diet/foods/${food.id}`, food);
      context.commit('diet/updateFood', updatedFood);
    } else {
      const createdFood = await http.put('/api/health/diet/foods', food);
      context.commit('diet/addFood', createdFood);
    }
  },
  async 'diet/removeFood' (context, food) {
    await http.delete(`/api/health/diet/foods/${food.id}`);
    context.commit('diet/removeFood', food);
  },

  async 'diet/fetchRecipes' (context) {
    const recipes = await http.get('/api/health/diet/recipes');
    context.commit('diet/setRecipes', { recipes, setLoaded: true });
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
      context.dispatch('diet/fetchFoods'),
      context.dispatch('diet/fetchRecipes'),
    ]);
  },

  'calculator/setItems' (context, items) {
    context.commit('calculator/setItemSkeletons', items);
  },
  'calculator/updateItem' (context, item) {
    const items = context.getters['calculator/items'];
    context.dispatch('calculator/setItems', items.map(subject => {
      if (subject.id === item.id) return item;
      return subject;
    }));
  },
  'calculator/removeItem' (context, item) {
    const items = context.getters['calculator/items'];
    context.dispatch('calculator/setItems', items.filter(subject => subject.id !== item.id));
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
