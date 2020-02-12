import axios from 'axios';

import config from '../config';

const { API_URL, DEV_API_RESPONSE_DELAY } = config;

class Http {
  constructor () {
    this._authHeader = null;

    this._axios = axios.create({
      baseURL: API_URL,
    });

    this._axios.interceptors.response.use(response => {
      if (this._authHeader) {
        const responseAuthHeaderValue = response.config.headers[this._authHeader.name];
        if (responseAuthHeaderValue !== this._authHeader.value) {
          this.setAuthHeader({ name: this._authHeader.name, value: responseAuthHeaderValue });
        }
      }
      return response;
    });

    if (DEV_API_RESPONSE_DELAY && DEV_API_RESPONSE_DELAY !== 0) {
      this._axios.interceptors.request.use(request => {
        return new Promise(resolve => window.setTimeout(() => { resolve(request); }, DEV_API_RESPONSE_DELAY));
      });
    }
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

  setAuthHeader ({ name, value }) {
    this._authHeader = { name, value };
    this._axios.defaults.headers.common[name] = value;
  }

  clearAuthHeader () {
    this._axios.defaults.headers.common[this._authHeader.name] = null;
    this._authHeader = null;
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
}

export default new Http();
