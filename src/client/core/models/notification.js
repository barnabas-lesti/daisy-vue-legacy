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
  constructor ({ type, text, textKey }) {
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.text = text;
    this.textKey = textKey;
    this.type = type;
  }
}
