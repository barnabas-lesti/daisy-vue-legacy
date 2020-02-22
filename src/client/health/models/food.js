const units = {
  G: 'g',
  ML: 'ml',
  PIECES: 'pieces',
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
}
