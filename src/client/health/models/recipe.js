import Food from './food';

class Ingredient extends Food {
  constructor (args = {}) {
    super(args);
    this.amount = args.amount || 0;
  }
}

export default class Recipe {
  static Ingredient = Ingredient;
  static getNutrients = Food.getNutrients;

  /**
   * @param {Recipe} args
   */
  constructor ({ id, userId, name, description, ingredients, serving } = {}) {
    this.id = id;
    this.userId = `${userId || ''}`;
    this.name = name;
    this.description = description;

    this.ingredients = (ingredients || []).map(item => new Ingredient(item));
    this.serving = new Food.Serving(serving);
  }

  getNutrients () {
    return Food.getNutrients(this.ingredients);
  }
}
