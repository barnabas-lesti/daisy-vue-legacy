const units = {
  G: 'g',
  ML: 'ml',
  PIECES: 'pieces',
  PLATES: 'plates',
  SERVING: 'serving',
  MUG: 'mug',
  CUP: 'cup',
  TEASPOON: 'teaspoon',
};
const unitValues = Object.keys(units).map(key => units[key]);

class Nutrients {
  constructor ({ calories, carbs, protein, fat } = {}) {
    this.calories = calories || 0;
    this.carbs = carbs || 0;
    this.protein = protein || 0;
    this.fat = fat || 0;
  }
}

class Serving {
  constructor ({ unit, value } = {}) {
    this.unit = unit || unitValues[0];
    this.value = value || 0;
  }
}

export default class Food {
  static units = units;
  static unitValues = unitValues;
  static Nutrients = Nutrients;
  static Serving = Serving;
  static getNutrients = getNutrients;
  static areNutrientsEmpty = areNutrientsEmpty;

  /**
   * @param {Food} args
   */
  constructor ({ id, userId, name, description, nutrients, serving } = {}) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;

    this.nutrients = new Nutrients(nutrients);
    this.serving = new Serving(serving);
  }

  getNutrients () {
    return this.nutrients;
  }

  areNutrientsEmpty () {
    return areNutrientsEmpty(this.getNutrients());
  }
}

function getNutrients (items) {
  if (!items || !items.length) return new Nutrients();

  const summary = items.reduce((summary, nextItem) => {
    const multiplier = nextItem.amount / nextItem.serving.value;
    const nutrients = typeof nextItem.getNutrients === 'function' ? nextItem.getNutrients() : nextItem.nutrients;
    const { calories, carbs, protein, fat } = nutrients;
    summary.calories += calories * multiplier;
    summary.carbs += carbs * multiplier;
    summary.protein += protein * multiplier;
    summary.fat += fat * multiplier;
    return summary;
  }, new Nutrients());

  return summary;
}

function areNutrientsEmpty (nutrients) {
  const { calories, carbs, protein, fat } = nutrients || {};
  return !calories && !carbs && !protein && !fat;
}
