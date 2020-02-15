import axios from 'axios';

import config from './config';
import eventBus from './event-bus';
import store from './store';

const { BASE_URL, DEV_API_RESPONSE_DELAY } = config;

class Http {
  constructor () {
    this._authHeader = null;

    this._axios = axios.create({
      baseURL: BASE_URL,
    });

    this._watchStoreAuthHeader();
    this._watchResponseAuthHeader();
    this._delayResponses();
  }

  /**
   * @param {String} path
   * @param {Object=} payload
   */
  async delete (path, payload) {
    const data = await this._sendRequest(this._axios.delete, path, payload);
    return data;
  }

  /**
   * @param {String} path
   * @param {Object=} payload
   */
  async patch (path, payload) {
    const data = await this._sendRequest(this._axios.patch, path, payload);
    return data;
  }

  /**
   * @param {String} path
   * @param {Object=} payload
   */
  async put (path, payload) {
    const data = await this._sendRequest(this._axios.put, path, payload);
    return data;
  }

  /**
   * @param {String} path
   * @param {Object=} payload
   */
  async post (path, payload) {
    const data = await this._sendRequest(this._axios.post, path, payload);
    return data;
  }

  /**
   * @param {String} path
   * @param {Object=} payload
   */
  async get (path, payload) {
    const data = await this._sendRequest(this._axios.get, path, payload);
    return data;
  }

  /**
   * @param {Function} method
   * @param {String} path
   * @param {Object=} payload
   */
  async _sendRequest (method, path, payload) {
    try {
      const { data } = await method(path, payload);
      return data;
    } catch ({ response }) {
      throw response.data;
    }
  }

  /**
   * @param {Object} authHeader
   */
  setAuthHeader ({ name, value }) {
    this._authHeader = { name, value };
    this._axios.defaults.headers.common[name] = value;
  }

  clearAuthHeader () {
    if (this._authHeader) {
      this._axios.defaults.headers.common[this._authHeader.name] = null;
      this._authHeader = null;
    }
  }

  _watchStoreAuthHeader () {
    eventBus.$on('core/authHeaderSet', authHeader => {
      if (authHeader) return this.setAuthHeader(authHeader);
      return this.clearAuthHeader();
    });
  }

  _watchResponseAuthHeader () {
    this._axios.interceptors.response.use(response => {
      if (this._authHeader) {
        const responseAuthHeaderValue = response.headers[this._authHeader.name];
        if (responseAuthHeaderValue !== this._authHeader.value) {
          store.commit('core/setAuthHeader', { name: this._authHeader.name, value: responseAuthHeaderValue });
        }
      }
      return response;
    });
  }

  _delayResponses () {
    if (DEV_API_RESPONSE_DELAY && DEV_API_RESPONSE_DELAY !== 0) {
      this._axios.interceptors.request.use(request => {
        return new Promise(resolve => window.setTimeout(() => { resolve(request); }, DEV_API_RESPONSE_DELAY));
      });
    }
  }
}

export default new Http();
