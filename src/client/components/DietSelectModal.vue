<template lang="pug">
  common-modal.diet-select-modal(
    v-model="value"
    :title="title || $t('components.dietSelectModal.title')"
    :loading="loading"
    :content-class="contentClass"
    @cancel="$emit('cancel')"
    @confirm="$emit('confirm', localSelectedItems)"
  )
    v-row
      v-col
        diet-table-filters(v-model="searchString")
    v-row
      v-col
        diet-table.diet-select-modal__table(
          v-model="localSelectedItems"
          :search-string="searchString"
          :items="items"
          :loading="loading"
          selectable
          with-amount
        )
</template>

<script>
import CommonModal from './CommonModal';
import DietTable from './DietTable';
import DietTableFilters from './DietTableFilters';

export default {
  components: {
    CommonModal,
    DietTable,
    DietTableFilters,
  },
  props: {
    value: Boolean,
    loading: Boolean,
    title: String,
    contentClass: String,
    items: {
      type: Array,
      default: () => [],
    },
    selectedItems: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      searchString: '',
      localSelectedItems: [...this.selectedItems],
    };
  },
  watch: {
    'selectedItems' (newValue) { this.localSelectedItems = [...newValue]; },
  },
};
</script>
