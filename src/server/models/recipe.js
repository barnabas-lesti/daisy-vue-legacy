const mongoose = require('mongoose');

const Food = require('./food');

const Doc = mongoose.model('Recipe', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ingredients: {
    default: [],
    type: [
      {
        amount: Number,
        food: {
          ref: 'Food',
          type: mongoose.SchemaTypes.ObjectId,
        },
      },
    ],
  },
  serving: {
    unit: {
      type: String,
      enum: Food.unitValues,
      default: Food.unitValues[0],
    },
    value: {
      type: Number,
      default: 0,
    },
  },
}, {
  id: true,
  toJSON: {
    versionKey: false,
  },
  toObject: {
    versionKey: false,
  },
}));

class Ingredient extends Food {
  constructor (args = {}) {
    super(args);
    this.amount = args.amount || 0;
  }
}

class Recipe {
  static Doc = Doc;
  static units = Food.units;
  static unitValues = Food.unitValues;
  static Ingredient = Ingredient;
  static convertToSaveable = convertToSaveable;
  static convertFromDoc = convertFromDoc;

  /**
   * @param {Recipe} args
   */
  constructor ({ _id, id, userId, name, description, ingredients, serving = {} } = {}) {
    this.id = `${_id || id || ''}`;
    this.userId = `${userId || ''}`;
    this.name = name;
    this.description = description;

    this.ingredients = (ingredients || []).map(item => new Ingredient({ ...item, ...item.food }));

    const { unit = Recipe.unitValues[0], value = 0 } = serving;
    this.serving = { unit, value };
  }

  convertToSaveable () {
    return convertToSaveable(this);
  }
}

function convertToSaveable (item) {
  return {
    ...item,
    ingredients: item.ingredients.map(item => {
      item.food = item.id;
      return item;
    }),
  };
}

function convertFromDoc (doc) {
  const { ingredients, ...source } = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return new Recipe({
    ...source,
    ingredients: ingredients.map(item => ({
      ...item,
      ...item.food,
    })),
  });
}

module.exports = Recipe;
