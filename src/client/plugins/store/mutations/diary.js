import DiaryItem from '../../../models/diary-item';

export default {
  'diary/items/update' (state, payload = []) {
    const providedDateStrings = payload.map(item => item.dateString);
    const existingItems = state.diary.items.filter(item => providedDateStrings.indexOf(item.dateString) !== -1);
    const updatedItems = payload.map(payloadItem => {
      const existingItem = existingItems.filter(item => item.dateString === payloadItem.dateString)[0] || {};
      return new DiaryItem({ ...existingItem, ...payloadItem });
    });
    const filteredExistingItems = state.diary.items.filter(item => providedDateStrings.indexOf(item.dateString) === -1);
    filteredExistingItems.push(...updatedItems);
    state.diary.items = [...filteredExistingItems];
  },
};
