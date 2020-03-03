import Food from './food';
import Recipe from './recipe';

const itemTypes = {
  FOOD: 'Food',
  RECIPE: 'Recipe',
};

export default class DietItem {
  static itemTypes = itemTypes;
  static getNutrients = Food.getNutrients;

  /**
   * @param {DietItem} args
   */
  constructor ({ id, userId, name, description, serving, itemType, amount, nutrients, ingredients } = {}) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.serving = new Food.Serving(serving);

    this.itemType = itemType || (ingredients ? itemTypes.RECIPE : itemTypes.FOOD);
    this.amount = amount !== undefined && amount !== null ? amount : this.serving.value;

    this.nutrients = new Food.Nutrients(nutrients);
    this.ingredients = (ingredients || []).map(item => new Recipe.Ingredient(item));
  }

  getNutrients () {
    switch (this.itemType) {
      case itemTypes.FOOD: return this.nutrients;
      case itemTypes.RECIPE: return Recipe.getNutrients(this.ingredients);
      default: return new Food.Nutrients();
    }
  }

  /**
   * @param {Food} food
   */
  static convertFromFood (food) {
    return new DietItem({ itemType: itemTypes.FOOD, ...food });
  }

  /**
   * @param {Recipe} recipe
   */
  static convertFromRecipe (recipe) {
    return new DietItem({ itemType: itemTypes.RECIPE, ...recipe });
  }

  /**
   * @param {Recipe.Ingredient} ingredient
   */
  static convertFromIngredient (ingredient) {
    return new DietItem({ itemType: itemTypes.FOOD, ...ingredient });
  }
}
