import DietItem from '../../../models/diet-item';

export default {
  'diet/items' (state) {
    const { foods, recipes } = state.diet;
    if (!foods || !recipes) return null;
    return [
      ...(foods.map(item => DietItem.convertFromFood(item))),
      ...(recipes.map(item => DietItem.convertFromRecipe(item))),
    ];
  },
};
