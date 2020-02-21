import DietItem from '../../models/diet-item';

export default {
  calculatorSummary ({ calculator }) {
    if (!calculator.items.length) {
      return null;
    }

    const { nutrients } = calculator.items.reduce((summary, nextItem) => {
      const multiplier = nextItem.amount / nextItem.serving.value;
      summary.nutrients.calories += nextItem.nutrients.calories * multiplier;
      summary.nutrients.carbs += nextItem.nutrients.carbs * multiplier;
      summary.nutrients.protein += nextItem.nutrients.protein * multiplier;
      summary.nutrients.fat += nextItem.nutrients.fat * multiplier;
      return summary;
    }, new DietItem());
    return nutrients;
  },
};
