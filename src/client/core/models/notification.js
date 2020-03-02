const types = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export default class Notification {
  static types = types
  static createId = createId;

  /**
   * @param {'success'|'info'|'warning'|'error'} type
   * @param {String} text
   * @param {String=} textKey
   */
  constructor ({ id, type, text, textKey }) {
    this.id = id || createId();
    this.text = text;
    this.textKey = textKey;
    this.type = type;
  }
}

function createId () {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
