import http from '../../../core/plugins/http';

import DiaryItem from '../../models/diary-item';

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

  async 'diary/fetchItem' (context, dateString) {
    try {
      const item = await http.get(`/api/health/diary/${dateString}`);
      context.commit('diary/setItem', { ...item, dateString });
    } catch ({ error }) {
      if (error !== 'NOT_FOUND') throw error;
      context.commit('diary/setItem', { dateString });
    }
  },
  async 'diary/ensureItem' (context, dateString) {
    const diaryItem = context.state.diary.item || {};
    dateString = dateString || diaryItem.dateString || DiaryItem.today();
    if (diaryItem.dateString !== dateString) {
      await context.dispatch('diary/fetchItem', dateString);
    }
  },
  async 'diary/updateItem' (context, item) {
    context.commit('diary/updateItem', item);
  },
  async 'diary/saveItem' (context, item) {
    if (item.id) {
      const updatedItem = await http.patch(`/api/health/diary/${item.dateString}`, item);
      context.commit('diary/setItem', updatedItem);
    } else {
      const savedItem = await http.put('/api/health/diary', item);
      context.commit('diary/setItem', savedItem);
    }
  },
  async 'diary/nutrientTrend/fetchItems' (context, dateString) {
    const items = await http.get('/api/health/diary', { params: { 'week-of-day': dateString } });
    context.commit('diary/nutrientTrend/setItems', items);
  },
  async 'diary/nutrientTrend/ensureItems' (context, dateStringCandidate) {
    const { nutrientTrend } = context.state.diary;
    const currentDateString = nutrientTrend.dateString;
    const newDateString = dateStringCandidate || currentDateString || DiaryItem.today();
    if (!nutrientTrend.items || currentDateString !== newDateString) {
      const activeDateRange = DiaryItem.getDatesOfWeek(currentDateString)
        .map(date => date.format(DiaryItem.DATE_FORMAT));
      context.commit('diary/nutrientTrend/setDateString', newDateString);
      if (activeDateRange.indexOf(newDateString) === -1) {
        await context.dispatch('diary/nutrientTrend/fetchItems', newDateString);
      }
    }
  },
};
