import Food from './food';
import Recipe from './recipe';

const types = {
  RECIPE: 'recipe',
  FOOD: 'food',
};

export default class CalculableItem {
  static types = types;

  /**
   * @param {CalculableItem} args
   */
  constructor ({ id, userId, amount, name, description, type, nutrients, ingredients, serving } = {}) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;

    this.type = type || types.FOOD;
    this.serving = new Food.Serving(serving);
    this.amount = amount !== undefined && amount !== null ? amount : this.serving.value;
    this.nutrients = new Food.Nutrients(nutrients);
    this.ingredients = (ingredients || []).map(item => new Recipe.Ingredient(item));
  }

  getNutrients () {
    switch (this.type) {
      case types.FOOD: return this.nutrients;
      case types.RECIPE: return Recipe.getNutrients(this.ingredients);
      default: return {};
    }
  }

  /**
   * @param {Food} food
   */
  static convertFromFood (food) {
    return new CalculableItem({ type: types.FOOD, ...food });
  }

  /**
   * @param {Recipe} recipe
   */
  static convertFromRecipe (recipe) {
    return new CalculableItem({ type: types.RECIPE, ...recipe });
  }

  /**
   * @param {Recipe.Ingredient} ingredient
   */
  static convertFromIngredient (ingredient) {
    return new CalculableItem({ type: types.FOOD, ...ingredient.food, amount: ingredient.amount });
  }
}
