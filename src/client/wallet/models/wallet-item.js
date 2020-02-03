import moment from 'moment';

// import { DATE_FORMAT, categories, currencies, itemTypes, paymentTypes } from '../constants';

export default class WalletItem {
  constructor ({ category, creatorId, currency, id, itemType, name, paymentType, transactionDate, value } = {}) {
    this.category = category || categories[0];
    this.creatorId = creatorId;
    this.currency = currency || currencies[0];
    this.id = id;
    this.itemType = itemType || itemTypes[0];
    this.name = name;
    this.paymentType = paymentType || paymentTypes[0];
    this.transactionDate = transactionDate || (new Date()).getTime();
    this.value = value || 0;
  }

  getFormattedTransactionDate () {
    return moment(this.transactionDate).format(DATE_FORMAT);
  }

  setFormattedTransactionDate (value) {
    this.transactionDate = parseInt(moment(value, DATE_FORMAT).format('x'), 10);
  }
}
