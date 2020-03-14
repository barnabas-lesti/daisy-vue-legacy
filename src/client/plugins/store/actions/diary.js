import http from '../../../plugins/http';

export default {
  async 'diary/items/fetch' (context, dateStrings = []) {
    const responseItems = await http.get('/api/diary', { params: { 'by-date-strings': dateStrings } });
    const items = dateStrings.map(dateString => {
      return responseItems.filter(item => item.dateString === dateString)[0] || { dateString };
    });
    context.commit('diary/items/update', items);
  },
  async 'diary/items/ensure' (context, dateStrings = []) {
    const existingDateStrings = context.state.diary.items.map(item => item.dateString);
    const missingDateStrings = dateStrings.filter(dateString => existingDateStrings.indexOf(dateString) === -1);
    if (missingDateStrings.length > 0) {
      await context.dispatch('diary/items/fetch', missingDateStrings);
    }
  },
  async 'diary/localItem/update' (context, item) {
    context.commit('diary/items/update', [ item ]);
  },
  async 'diary/item/save' (context, item) {
    if (item.id) {
      const updatedItem = await http.patch(`/api/diary/${item.dateString}`, item);
      context.commit('diary/items/update', [ updatedItem ]);
    } else {
      const savedItem = await http.put('/api/diary', item);
      context.commit('diary/items/update', [ savedItem ]);
    }
  },
};
