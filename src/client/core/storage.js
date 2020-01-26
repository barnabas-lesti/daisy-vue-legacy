const localStorage = window.localStorage;

class Storage {
  saveToLocalStorage (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getFromLocalStorage (key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

export default new Storage();
