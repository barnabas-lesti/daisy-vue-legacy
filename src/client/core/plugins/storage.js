import Vue from 'vue';

const { localStorage } = window;

class Storage {
  saveToLocalStorage (key, data = null) {
    const storedData = this.getFromLocalStorage(key);
    if (typeof data === 'object') {
      localStorage.setItem(key, JSON.stringify({ ...storedData, ...data }));
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
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
