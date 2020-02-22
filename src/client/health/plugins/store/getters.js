import { CalculableItem, Food } from '../../models';

export default {
  dietItems (state) {
    const { food, recipes } = state.diet;
    return [
      ...(food.map(item => CalculableItem.convertFromFood(item))),
      ...(recipes.map(item => CalculableItem.convertFromRecipe(item))),
    ];
  },

  calculatorSummary ({ calculator }) {
    if (!calculator.items.length) {
      return null;
    }

    const nutrients = calculator.items.reduce((summary, nextItem) => {
      const multiplier = nextItem.amount / nextItem.serving.value;
      summary.calories += nextItem.getNutrients().calories * multiplier;
      summary.carbs += nextItem.getNutrients().carbs * multiplier;
      summary.protein += nextItem.getNutrients().protein * multiplier;
      summary.fat += nextItem.getNutrients().fat * multiplier;
      return summary;
    }, new Food.Nutrients());
    return nutrients;
  },
};
