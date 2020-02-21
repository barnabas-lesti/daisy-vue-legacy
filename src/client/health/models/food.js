const units = {
  G: 'g',
  ML: 'ml',
  PIECES: 'pieces',
};
const unitValues = Object.keys(units).map(key => units[key]);

export default class Food {
  static units = units;
  static unitValues = unitValues;

  /**
   * @param {Food} args
   */
  constructor ({ id, userId, name, description, nutrients = {}, serving = {} } = {}) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;

    const { calories = 0, carbs = 0, fat = 0, protein = 0 } = nutrients;
    this.nutrients = { calories, carbs, fat, protein };

    const { unit = unitValues[0], value = 0 } = serving;
    this.serving = { unit, value };
  }
}
