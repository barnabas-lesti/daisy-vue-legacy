import http from '../../../core/plugins/http';

export default {
  'loading' (context, value) {
    context.commit('core/setLoading', value, { root: true });
  },

  async 'diet/fetchFoods' (context) {
    context.dispatch('loading', true);
    const foods = await http.get('/api/health/diet/foods');
    context.commit('diet/setFoods', { foods, setLoaded: true });
    context.dispatch('loading', false);
  },
  async 'diet/saveFood' (context, food) {
    context.dispatch('loading', true);
    if (food.id) {
      const updatedFood = await http.patch(`/api/health/diet/foods/${food.id}`, food);
      context.commit('diet/updateFood', updatedFood);
    } else {
      const createdFood = await http.put('/api/health/diet/foods', food);
      context.commit('diet/addFood', createdFood);
    }
    context.dispatch('loading', false);
  },
  async 'diet/removeFood' (context, food) {
    context.dispatch('loading', true);
    await http.delete(`/api/health/diet/foods/${food.id}`);
    context.commit('diet/removeFood', food);
    context.dispatch('loading', false);
  },

  async 'diet/fetchRecipes' (context) {
    context.dispatch('loading', true);
    const recipes = await http.get('/api/health/diet/recipes');
    context.commit('diet/setRecipes', { recipes, setLoaded: true });
    context.dispatch('loading', false);
  },
  async 'diet/saveRecipe' (context, recipe) {
    context.dispatch('loading', true);
    if (recipe.id) {
      await http.patch(`/api/health/diet/recipes/${recipe.id}`, recipe);
      context.commit('diet/updateRecipe', recipe);
    } else {
      const { id } = await http.put('/api/health/diet/recipes', recipe);
      context.commit('diet/addRecipe', { ...recipe, id });
    }
    context.dispatch('loading', false);
  },
  async 'diet/removeRecipe' (context, recipe) {
    context.dispatch('loading', true);
    await http.delete(`/api/health/diet/recipes/${recipe.id}`);
    context.commit('diet/removeRecipe', recipe);
    context.dispatch('loading', false);
  },

  async 'diet/fetchItems' (context) {
    context.dispatch('loading', true);
    await Promise.all([
      context.dispatch('diet/fetchFoods'),
      context.dispatch('diet/fetchRecipes'),
    ]);
    context.dispatch('loading', false);
  },
  async 'diet/ensureItems' (context) {
    const dietItems = context.getters['diet/items'];
    if (dietItems) return;
    await context.dispatch('diet/fetchItems');
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

  async 'diary/fetchItem' (context, dateString) {
    context.dispatch('loading', true);
    try {
      const item = await http.get(`/api/health/diary/${dateString}`);
      context.commit('diary/setItem', { ...item, dateString });
    } catch ({ error }) {
      if (error !== 'NOT_FOUND') throw error;
      context.commit('diary/setItem', { dateString });
    }
    context.dispatch('loading', false);
  },
  async 'diary/ensureItem' (context, dateString) {
    context.dispatch('loading', true);
    const { item } = context.state.diary;
    if (!item || item.dateString !== dateString) {
      await context.dispatch('diary/fetchItem', dateString);
    }
    context.dispatch('loading', false);
  },
  async 'diary/updateItem' (context, item) {
    context.commit('diary/updateItem', item);
  },
  async 'diary/saveItem' (context, item) {
    context.dispatch('loading', true);
    if (item.id) {
      const updatedItem = await http.patch(`/api/health/diary/${item.dateString}`, item);
      context.commit('diary/setItem', updatedItem);
    } else {
      const savedItem = await http.put('/api/health/diary', item);
      context.commit('diary/setItem', savedItem);
    }
    context.dispatch('loading', false);
  },
};
