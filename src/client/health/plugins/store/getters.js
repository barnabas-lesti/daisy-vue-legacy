import { CalculableItem, Food } from '../../models';

export default {
  'diet/items' (state) {
    const { foods, recipes } = state.diet;
    return [
      ...(foods.map(item => CalculableItem.convertFromFood(item))),
      ...(recipes.map(item => CalculableItem.convertFromRecipe(item))),
    ];
  },
  'diet/areItemsLoaded' (state) {
    const { areFoodsLoaded, areRecipesLoaded } = state.diet;
    return areFoodsLoaded && areRecipesLoaded;
  },

  'calculator/items' (state, getters) {
    return state.calculator.itemSkeletons
      .map(item => {
        const match = getters['diet/items'].filter(({ id }) => id === item.id)[0];
        if (!match) return null;
        return new CalculableItem({ ...match, amount: item.amount });
      })
      .filter(item => item !== undefined && item !== null);
  },

  'calculator/summary' (state, getters) {
    if (!getters['calculator/items'].length) {
      return null;
    }

    const nutrients = getters['calculator/items'].reduce((summary, nextItem) => {
      const multiplier = nextItem.amount / nextItem.serving.value;
      summary.calories += nextItem.getNutrients().calories * multiplier;
      summary.carbs += nextItem.getNutrients().carbs * multiplier;
      summary.protein += nextItem.getNutrients().protein * multiplier;
      summary.fat += nextItem.getNutrients().fat * multiplier;
      return summary;
    }, new Food.Nutrients());

    const { calories, carbs, protein, fat } = nutrients;
    if (!calories && !carbs && !protein && !fat) return null;

    return nutrients;
  },
};
