import DietItem from './diet-item';

export default class CalculatorItem {
  /**
   * @param {CalculatorItem} args
   */
  constructor ({ item, serving }) {
    this.item = item || new DietItem();
    this.serving = serving || { value: 0 };
  }
}
