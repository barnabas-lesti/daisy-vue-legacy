import Food from './food';

const types = {
  RECIPE: 'recipe',
  FOOD: 'food',
};

export default class CalculatorItem extends Food {
  static types = types;

  /**
   * @param {CalculatorItem} args
   */
  constructor (args) {
    super(args);
    /**
     * @type {String}
     */
    this.type = args.type;
  }

  /**
   * @param {Food} food
   */
  static convertFromFood (food) {
    return new CalculatorItem({ type: types.FOOD, ...food });
  }
  static convertFromRecipe (recipe) {}
}
