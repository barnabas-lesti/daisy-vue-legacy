import Food from './food';

const types = {
  RECIPE: 'recipe',
  FOOD: 'food',
};

export default class DietItem extends Food {
  static types = types;

  /**
   * @param {DietItem} args
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
    return new DietItem({ type: types.FOOD, ...food });
  }
  static convertFromRecipe (recipe) {}
}
