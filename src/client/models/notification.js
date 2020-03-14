const types = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export default class Notification {
  static types = types

  /**
   * @param {'success'|'info'|'warning'|'error'} type
   * @param {String} text
   * @param {String=} textKey
   */
  constructor ({ id, type, text, textKey }) {
    this.id = id;
    this.text = text;
    this.textKey = textKey;
    this.type = type;
  }
}
