<template lang="pug">
  modal.select-modal(
    v-model="value"
    :title="title || $t('health.components.selectModal.title')"
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
        diet-table.select-modal__table(
          v-model="localSelectedItems"
          :search-string="searchString"
          :items="items"
          :loading="loading"
          selectable
          with-amount
        )
</template>

<script>
import Modal from '../../core/components/Modal';
import DietTable from './DietTable';
import DietTableFilters from './DietTableFilters';

export default {
  components: {
    Modal,
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
