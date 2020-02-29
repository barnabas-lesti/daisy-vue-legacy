import DietItem from '../../models/diet-item';

export default {
  'diet/items' (state) {
    const { foods, recipes } = state.diet;
    if (!foods || !recipes) return null;
    return [
      ...(foods.map(item => DietItem.convertFromFood(item))),
      ...(recipes.map(item => DietItem.convertFromRecipe(item))),
    ];
  },

  'calculator/items' (state, getters) {
    return state.calculator.itemSkeletons
      .map(item => {
        const match = getters['diet/items'].filter(({ id }) => id === item.id)[0];
        if (!match) return null;
        return new DietItem({ ...match, amount: item.amount });
      })
      .filter(item => item !== undefined && item !== null);
  },
};
