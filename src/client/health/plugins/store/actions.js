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
      await http.patch(`/api/health/diet/recipes/${recipe.id}`, recipe);
      context.commit('diet/updateRecipe', recipe);
    } else {
      const { id } = await http.put('/api/health/diet/recipes', recipe);
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
  async 'diet/ensureItems' (context) {
    const dietItems = context.getters['diet/items'];
    if (dietItems) return;
    await context.dispatch('diet/fetchItems');
  },

  async 'diary/fetchItems' (context, dateStrings = []) {
    const responseItems = await http.get('/api/health/diary', { params: { 'by-date-strings': dateStrings } });
    const items = dateStrings.map(dateString => {
      return responseItems.filter(item => item.dateString === dateString)[0] || { dateString };
    });
    context.commit('diary/updateItems', items);
  },
  async 'diary/ensureItems' (context, dateStrings = []) {
    const existingDateStrings = context.state.diary.items.map(item => item.dateString);
    const missingDateStrings = dateStrings.filter(dateString => existingDateStrings.indexOf(dateString) === -1);
    if (missingDateStrings.length > 0) {
      await context.dispatch('diary/fetchItems', missingDateStrings);
    }
  },
  async 'diary/updateLocalItem' (context, item) {
    context.commit('diary/updateItems', [ item ]);
  },
  async 'diary/saveItem' (context, item) {
    if (item.id) {
      const updatedItem = await http.patch(`/api/health/diary/${item.dateString}`, item);
      context.commit('diary/updateItems', [ updatedItem ]);
    } else {
      const savedItem = await http.put('/api/health/diary', item);
      context.commit('diary/updateItems', [ savedItem ]);
    }
  },
};
