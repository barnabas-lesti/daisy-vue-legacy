const mongoose = require('mongoose');

const { categories, currencies, itemTypes, paymentTypes } = require('../constants');

const walletItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: categories,
    default: categories[0],
  },
  creatorId: {
    // TODO: Make required and implement population
    type: String,
  },
  currency: {
    type: String,
    enum: currencies,
    default: currencies[0],
  },
  itemType: {
    type: String,
    enum: itemTypes,
    default: itemTypes[0],
  },
  name: {
    required: true,
    trim: true,
    type: String,
  },
  paymentType: {
    type: String,
    enum: paymentTypes,
    default: paymentTypes[0],
  },
  transactionDate: {
    type: Date,
    default: new Date(),
  },
  value: {
    required: true,
    type: Number,
  },
}, {
  id: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: {
    versionKey: false,
    virtuals: true,
  },
});

module.exports = mongoose.model('WalletItem', walletItemSchema);
