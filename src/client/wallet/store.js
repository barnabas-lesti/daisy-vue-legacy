import { store } from '../core/plugins';

import WalletItem from './models/wallet-item';

store.registerModule('wallet', {
  namespaced: true,

  state: {
    item: null,
    items: [],
  },

  mutations: {
    setItem (state, item) {
      state.item = new WalletItem(item);
    },
    setItems (state, items) {
      state.items = items.map(item => new WalletItem(item));
    },
  },

  actions: {
    async fetchItem (context, id) {
      // TODO: Implement fetch from server logic
      const tempItem = { name: 'Test item in store', value: 599, id: 1 };
      return new Promise(resolve => {
        window.setTimeout(() => {
          context.commit('setItem', tempItem);
          resolve();
        }, 500);
      });
    },

    async fetchItems (context) {
      // TODO: Implement fetch from server logic
      const tempItem1 = { name: 'Test item 1', value: 199, id: 1 };
      const tempItem2 = { name: 'Test item 2', value: 599, id: 2 };
      const tempItem3 = { name: 'Test item 3', value: 1999, id: 3 };
      return new Promise(resolve => {
        window.setTimeout(() => {
          context.commit('setItems', [ tempItem1, tempItem2, tempItem3 ]);
          resolve();
        }, 500);
      });
    },

    async saveItem (context, item) {
      // TODO: Implement server logic
      return new Promise(resolve => {
        window.setTimeout(() => {
          resolve();
        }, 500);
      });
    },

    async deleteItem (context, id) {
      // TODO: Implement server logic
      return new Promise(resolve => {
        window.setTimeout(() => {
          resolve();
        }, 500);
      });
    }
  },
});
