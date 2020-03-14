import Food from '../../../models/food';
import Recipe from '../../../models/recipe';

export default {
  'diet/foods/set' (state, { foods = [], setLoaded }) {
    state.diet.foods = foods.map(item => new Food(item));
    if (setLoaded) state.diet.areFoodsLoaded = true;
  },
  'diet/food/update' (state, update) {
    const foods = state.diet.foods.splice(0);
    for (let i = 0; i < foods.length; i++) {
      if (foods[i].id === update.id) {
        foods[i] = new Food(update);
        break;
      }
    }
    state.diet.foods = foods;
  },
  'diet/food/add' (state, food) {
    state.diet.foods.push(new Food(food));
  },
  'diet/food/remove' (state, food) {
    state.diet.foods = state.diet.foods.splice(0).filter(item => item.id !== food.id);
  },

  'diet/recipes/set' (state, { recipes = [], setLoaded } = {}) {
    state.diet.recipes = recipes.map(item => new Recipe(item));
    if (setLoaded) state.diet.areRecipesLoaded = true;
  },
  'diet/recipe/update' (state, update) {
    const recipes = state.diet.recipes.splice(0);
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].id === update.id) {
        recipes[i] = new Recipe(update);
        break;
      }
    }
    state.diet.recipes = recipes;
  },
  'diet/recipe/add' (state, recipe) {
    state.diet.recipes.push(new Recipe(recipe));
  },
  'diet/recipe/remove' (state, recipe) {
    state.diet.recipes = state.diet.recipes.splice(0).filter(item => item.id !== recipe.id);
  },
};
