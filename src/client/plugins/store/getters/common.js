import i18n from '../../i18n';

export default {
  'common/loading': (state) => state.common.asyncRegistry.length > 0,

  'common/title': (state) => i18n.t(state.common.titleKey),
  'common/title/tab': (state, getters) => `${getters['common/title']} | ${i18n.t('common.appTitle')}`,
  'common/title/navbar': (state, getters) => `${getters['common/title']}`,

  'common/sidebarItems/sorted' (state) {
    const sortedItems = [...state.common.sidebarItems];
    sortedItems.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
    return sortedItems;
  },
};
