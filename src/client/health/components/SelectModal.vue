<template lang="pug">
  modal.select-modal(
    v-model="isOpen"
    :title="$t('health.components.selectModal.title')"
    :loading="loading"
    @cancel="$emit('cancel')"
    @confirm="$emit('confirm', innerSelectedItems)"
  )
    diet-table(
      v-model="innerSelectedItems"
      :items="sourceItems"
      :loading="loading"
      selectable
      with-search
      with-amount
      @select="onSelect($event)"
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
    sourceItems: Array,
    selectedItems: Array,
  },
  data () {
    return {
      innerSelectedItems: [...this.selectedItems],
    };
  },
  computed: {
    isOpen: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
  methods: {
    onSelect (item) {
      const alreadySelected = !!this.innerSelectedItems.filter(({ id }) => id === item.id)[0];
      if (alreadySelected) {
        this.innerSelectedItems = this.innerSelectedItems.filter(({ id }) => id !== item.id);
      } else {
        this.innerSelectedItems.push(item);
      }
    },
  },
  watch: {
    selectedItems (newValue) { this.innerSelectedItems = [...newValue]; },
  },
};
</script>
