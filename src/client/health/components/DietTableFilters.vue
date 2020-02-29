<template lang="pug">
  .diet-table-filters
    v-text-field.diet-table-filters__search(
      v-model="localValue"
      :label="$t('health.components.dietTableFilters.search')"
      :append-icon="$theme.icons.mdiMagnify"
      single-line
      hide-details
    )
</template>

<script>
const SEARCH_INPUT_DELAY = 300;

export default {
  props: {
    value: String,
  },
  data () {
    return {
      searchInputTimeoutId: null,
    };
  },
  computed: {
    localValue: {
      get () { return this.value; },
      set (newValue) {
        if (this.searchInputTimeoutId) clearTimeout(this.searchInputTimeoutId);
        this.searchInputTimeoutId = setTimeout(() => this.$emit('input', newValue), SEARCH_INPUT_DELAY);
      },
    },
  },
};
</script>
