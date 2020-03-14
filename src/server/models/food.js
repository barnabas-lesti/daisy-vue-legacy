const mongoose = require('mongoose');

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

const Doc = mongoose.model('Food', new mongoose.Schema({
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
  nutrients: {
    calories: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
  },
  serving: {
    unit: {
      type: String,
      enum: unitValues,
      default: unitValues[0],
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

class Food {
  static Doc = Doc;
  static units = units;
  static unitValues = unitValues;
  static Serving = Serving;
  static Nutrients = Nutrients;

  /**
   * @param {Food} args
   */
  constructor ({ _id, id, userId, name, description, nutrients = {}, serving = {} } = {}) {
    this.id = `${_id || id || ''}`;
    this.userId = `${userId || ''}`;
    this.name = name;
    this.description = description;

    this.nutrients = new Nutrients(nutrients);
    this.serving = new Serving(serving);
  }
}

module.exports = Food;
