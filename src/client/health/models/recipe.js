import Food from './food';

class Ingredient {
  constructor ({ amount, food }) {
    this.food = new Food(food);
    this.amount = amount || 0;
  }
}

export default class Recipe {
  static Ingredient = Ingredient;
  static Serving = Food.Serving;

  static getNutrients = getNutrients;

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
    return getNutrients(this.ingredients);
  }
}

function getNutrients (ingredients) {
  return ingredients.reduce((summary, nextItem) => {
    const multiplier = nextItem.amount / nextItem.food.serving.value;
    summary.calories += nextItem.food.nutrients.calories * multiplier;
    summary.carbs += nextItem.food.nutrients.carbs * multiplier;
    summary.protein += nextItem.food.nutrients.protein * multiplier;
    summary.fat += nextItem.food.nutrients.fat * multiplier;
    return summary;
  }, new Food.Nutrients());
}
