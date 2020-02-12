import Vue from 'vue';

const { localStorage } = window;

class Storage {
  saveToLocalStorage (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  getFromLocalStorage (key) {
    return JSON.parse(localStorage.getItem(key));
  }
  removeFromLocalStorage (key) {
    localStorage.removeItem(key);
  }
}

const storage = new Storage();
Vue.prototype.$storage = storage;

export default storage;
