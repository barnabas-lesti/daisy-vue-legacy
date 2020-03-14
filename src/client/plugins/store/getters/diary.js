export default {
  'diary/items/sorted' (state) {
    return [ ...state.diary.items ].sort((a, b) => {
      if (a.dateString > b.dateString) return 1;
      if (a.dateString < b.dateString) return -1;
      return 0;
    });
  },
};
