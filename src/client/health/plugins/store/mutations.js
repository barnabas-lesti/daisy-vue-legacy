import storage from '../../../core/plugins/storage';
import { Food, Recipe } from '../../models';

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

  'calculator/setItemSkeletons' (state, items) {
    state.calculator.itemSkeletons = [...items]
      .map(item => ({ amount: item.amount, id: item.id, type: item.type }));
    storage.saveToLocalStorage('health/calculator/itemSkeletons', state.calculator.itemSkeletons);
  },
};
