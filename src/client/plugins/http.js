import axios from 'axios';
import Vue from 'vue';

import config from './config';
import eventBus from './event-bus';
import store from './store';

const { AUTH_HEADER, env: { BASE_URL, DEV_API_RESPONSE_DELAY } } = config;

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
    const registryId = await store.dispatch('common/asyncRegistry/create');
    try {
      const { data } = await method(path, payload);
      return data;
    } catch ({ response }) {
      throw response.data;
    } finally {
      store.dispatch('common/asyncRegistry/remove', registryId);
    }
  }

  /**
   * @param {String} authHeader
   */
  setAuthHeader (authHeader) {
    this._authHeader = authHeader;
    this._axios.defaults.headers.common[AUTH_HEADER] = authHeader;
  }

  _watchStoreAuthHeader () {
    eventBus.$on('auth/authHeader/set', authHeader => {
      this.setAuthHeader(authHeader);
    });
  }

  _watchResponseAuthHeader () {
    this._axios.interceptors.response.use(response => {
      const responseAuthHeaderValue = response.headers[AUTH_HEADER];
      if (responseAuthHeaderValue !== this._authHeader) {
        store.commit('auth/authHeader/set', responseAuthHeaderValue);
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

const http = new Http();
Vue.prototype.$http = http;
export default http;
