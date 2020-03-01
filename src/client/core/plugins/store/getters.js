export default {
  'loading' (state) {
    return state.asyncRegistry.length > 0;
  },

  'sortedSidebarItems' ({ sidebarItems }) {
    const sortedItems = sidebarItems.splice(0);
    sortedItems.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
    return sortedItems;
  },
};
