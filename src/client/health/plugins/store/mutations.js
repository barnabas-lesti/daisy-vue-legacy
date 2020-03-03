import Food from '../../models/food';
import Recipe from '../../models/recipe';
import DiaryItem from '../../models/diary-item';

export default {
  'diet/setFoods' (state, { foods = [], setLoaded }) {
    state.diet.foods = foods.map(item => new Food(item));
    if (setLoaded) state.diet.areFoodsLoaded = true;
  },
  'diet/updateFood' (state, update) {
    const foods = state.diet.foods.splice(0);
    for (let i = 0; i < foods.length; i++) {
      if (foods[i].id === update.id) {
        foods[i] = new Food(update);
        break;
      }
    }
    state.diet.foods = foods;
  },
  'diet/addFood' (state, food) {
    state.diet.foods.push(new Food(food));
  },
  'diet/removeFood' (state, food) {
    state.diet.foods = state.diet.foods.splice(0).filter(item => item.id !== food.id);
  },

  'diet/setRecipes' (state, { recipes = [], setLoaded } = {}) {
    state.diet.recipes = recipes.map(item => new Recipe(item));
    if (setLoaded) state.diet.areRecipesLoaded = true;
  },
  'diet/updateRecipe' (state, update) {
    const recipes = state.diet.recipes.splice(0);
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].id === update.id) {
        recipes[i] = new Recipe(update);
        break;
      }
    }
    state.diet.recipes = recipes;
  },
  'diet/addRecipe' (state, recipe) {
    state.diet.recipes.push(new Recipe(recipe));
  },
  'diet/removeRecipe' (state, recipe) {
    state.diet.recipes = state.diet.recipes.splice(0).filter(item => item.id !== recipe.id);
  },

  'diary/updateItems' (state, payload = []) {
    const providedDateStrings = payload.map(item => item.dateString);
    const existingItems = state.diary.items.filter(item => providedDateStrings.indexOf(item.dateString) !== -1);
    const updatedItems = payload.map(payloadItem => {
      const existingItem = existingItems.filter(item => item.dateString === payloadItem.dateString)[0] || {};
      return new DiaryItem({ ...existingItem, ...payloadItem });
    });
    const filteredExistingItems = state.diary.items.filter(item => providedDateStrings.indexOf(item.dateString) === -1);
    filteredExistingItems.push(...updatedItems);
    state.diary.items = [...filteredExistingItems];
  },
};
