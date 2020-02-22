import { Food, Recipe, CalculableItem } from '../../models';

export default {
  'diet/setFood' (state, food = []) {
    state.diet.food = food.map(item => new Food(item));
  },
  'diet/updateFood' (state, update) {
    const food = state.diet.food.splice(0);
    for (let i = 0; i < food.length; i++) {
      if (food[i].id === update.id) {
        food[i] = new Food(update);
        break;
      }
    }
    state.diet.food = food;
  },
  'diet/addFood' (state, food) {
    state.diet.food.push(new Food(food));
  },
  'diet/removeFood' (state, food) {
    state.diet.food = state.diet.food.splice(0).filter(item => item.id !== food.id);
  },

  'diet/setRecipes' (state, recipes = []) {
    state.diet.recipes = recipes.map(item => new Recipe(item));
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

  'calculator/setItems' (state, items) {
    state.calculator.items = [...items].map(item => new CalculableItem(item));
  },
};
