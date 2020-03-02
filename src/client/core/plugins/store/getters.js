import i18n from '../i18n';

export default {
  'loading': (state) => state.asyncRegistry.length > 0,

  'title': (state) => i18n.t(state.titleKey),
  'title/tab': (state, getters) => `${getters['title']} | Aurora`,

  'sidebarItems/sorted' ({ sidebarItems }) {
    const sortedItems = [...sidebarItems];
    sortedItems.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
    return sortedItems;
  },
};
