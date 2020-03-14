const mongoose = require('mongoose');
const moment = require('moment');

const config = require('../config');
const DietItem = require('./diet-item');

const diaryItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dateString: {
    type: String,
    required: true,
  },
  items: {
    default: [],
    type: [
      {
        amount: Number,
        itemType: {
          type: String,
          enum: DietItem.itemTypeValues,
        },
        item: {
          refPath: 'items.itemType',
          type: mongoose.SchemaTypes.ObjectId,
        },
      },
    ],
  },
}, {
  id: true,
  toJSON: {
    versionKey: false,
  },
  toObject: {
    versionKey: false,
  },
});

diaryItemSchema.statics.deepPopulate = async function (docs) {
  const population0 = await this.populate(docs, { path: 'items.item' });
  const population1 = await this.populate(population0, { path: 'items.item.ingredients.food', model: 'Food' });
  return population1;
};

const Doc = mongoose.model('DiaryItem', diaryItemSchema);

class DiaryItem {
  static DATE_FORMAT = config.DATE_FORMAT;
  static Doc = Doc;
  static convertToSaveable = convertToSaveable;
  static convertFromDoc = convertFromDoc;
  static convertDateStringToDate = convertDateStringToDate;
  static convertDateToDateString = convertDateToDateString;
  static getDatesOfWeekByDate = getDatesOfWeekByDate;

  /**
   * @param {DiaryItem} args
   */
  constructor ({ _id, id, userId, summary, items, date, dateString } = {}) {
    this.id = `${_id || id || ''}`;
    this.userId = `${userId || ''}`;
    this.summary = summary;
    this.items = items ? items.map(item => new DietItem(item)) : [];

    this.dateString = dateString || moment(new Date()).format(config.DATE_FORMAT);
    this.date = date ? new Date(date) : new Date(this.dateString);
  }

  convertToSaveable () {
    return convertToSaveable(this);
  }
}

function getDatesOfWeekByDate (date) {
  date = typeof date === 'string' ? moment(date, config.DATE_FORMAT) : moment(date);
  const firstDateOfWeek = moment(date).subtract(date.isoWeekday() - 1, 'days');
  const dateList = [];
  for (let i = 0; i < 7; i++) {
    dateList.push(moment(firstDateOfWeek).add(i, 'days').format(DiaryItem.DATE_FORMAT));
  }
  return dateList;
}

function convertDateToDateString (date) {
  return moment(date || new Date()).format(config.DATE_FORMAT);
}

function convertDateStringToDate (dateString) {
  return new Date(moment(dateString, config.DATE_FORMAT).toDate());
}

function convertToSaveable (item) {
  return {
    ...item,
    items: item.items.map(item => DietItem.convertToSaveable(item)),
  };
}

function convertFromDoc (doc) {
  const { items, ...source } = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return new DiaryItem({
    ...source,
    items: items.map(item => DietItem.convertFromDoc(item)),
  });
}

module.exports = DiaryItem;
