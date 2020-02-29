import moment from 'moment';

import Food from './food';
import DietItem from './diet-item';

const DATE_FORMAT = 'YYYY-MM-DD';

export default class DiaryItem {
  static DATE_FORMAT = DATE_FORMAT;
  static isDateStringValid = isDateStringValid;
  static getNutrients = Food.getNutrients;
  static today = today;

  /**
   * @param {DiaryItem} args
   */
  constructor ({ id, userId, summary, items, date, dateString } = {}) {
    this.id = id;
    this.userId = userId;
    this.summary = summary;
    this.items = items ? items.map(item => new DietItem(item)) : [];

    this.dateString = dateString || moment(new Date()).format(DATE_FORMAT);
    this.date = date ? new Date(date) : new Date(this.dateString);
  }

  getNutrients () {
    return Food.getNutrients(this.items);
  }
}

function isDateStringValid (dateString) {
  const date = moment(dateString, DATE_FORMAT);
  return date.isValid();
}

function today () {
  return moment().format(DATE_FORMAT);
}
