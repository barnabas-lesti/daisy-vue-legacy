<template lang="pug">
  modal.select-modal(
    v-model="value"
    :title="$t('health.components.selectModal.title')"
    :loading="loading"
    @cancel="$emit('cancel')"
    @confirm="$emit('confirm', localSelectedItems)"
  )
    diet-table.select-modal__table(
      v-model="localSelectedItems"
      :items="items"
      :loading="loading"
      selectable
      with-search
      with-amount
      with-filters
    )
</template>

<script>
import Modal from '../../core/components/Modal.vue';
import DietTable from './DietTable.vue';

export default {
  components: {
    Modal,
    DietTable,
  },
  props: {
    value: Boolean,
    loading: Boolean,
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
      localSelectedItems: [...this.selectedItems],
    };
  },
  watch: {
    selectedItems (newValue) { this.localSelectedItems = [...newValue]; },
  },
};
</script>
