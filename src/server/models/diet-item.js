const Food = require('./food');
const Recipe = require('./recipe');

const itemTypes = {
  FOOD: 'Food',
  RECIPE: 'Recipe',
};

/**
 * @type {String[]}
 */
const itemTypeValues = Object.keys(itemTypes).map(key => itemTypes[key]);

class DietItem {
  static itemTypes = itemTypes;
  static itemTypeValues = itemTypeValues;
  static convertToSaveable = convertToSaveable;
  static convertFromDoc = convertFromDoc;

  /**
   * @param {DietItem} args
   */
  constructor ({ _id, id, userId, amount, name, description, itemType, nutrients, ingredients, serving } = {}) {
    this.id = `${_id || id || ''}`;
    this.userId = `${userId || ''}`;
    this.name = name;
    this.description = description;

    this.itemType = itemType || (ingredients ? itemTypes.RECIPE : itemTypes.FOOD);
    this.serving = new Food.Serving(serving);
    this.amount = amount !== undefined && amount !== null ? amount : this.serving.value;
    this.nutrients = nutrients ? new Food.Nutrients(nutrients) : undefined;

    this.ingredients = ingredients ? ingredients.map(item => new Recipe.Ingredient({ ...item, ...item.food })) : undefined;
  }

  convertToSaveable () {
    return convertToSaveable(this);
  }
}

function convertToSaveable ({ amount, id, _id, itemType }) {
  return {
    amount,
    itemType,
    item: _id || id,
  };
}

function convertFromDoc (doc) {
  const { item, ...source } = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return new DietItem({
    ...source,
    ...item,
  });
}

module.exports = DietItem;
