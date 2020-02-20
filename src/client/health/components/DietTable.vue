<template lang="pug">
  .diet-table(data-qa="health.components.dietTable")
    v-text-field.mb-4(
      v-if="withSearch"
      v-model="searchString"
      :label="$t('health.components.dietTable.search')"
      :append-icon="$icons.mdiMagnify"
      data-qa="health.components.dietTable.search"
      single-line
      hide-details
    )
    v-data-table.diet-table__table(
      v-model="model"
      :class="{ 'diet-table__table--mobile': $vuetify.breakpoint.xs, 'diet-table__table--selectable': selectable }"
      :loading="loading"
      :items="items"
      :search="searchString"
      :headers="headers"
      :item-key="itemKey"
      :items-per-page="itemsPerPage"
      :no-data-text="noDataText"
      :no-results-text="noResultsText"
      :loading-text="loadingText"
      :mobile-breakpoint="mobileBreakpoint"
      :footer-props="footer"
      :show-select="selectable"
      ref="table"
    )
      template(v-slot:header.name="{ header }")
        span.pl-10 {{ header.text }}
      template(v-slot:item.name="{ item }")
        .d-flex.align-center.py-2
          v-icon(:data-qa="`health.components.dietTable.icon.${item.type}`") {{ getItemIcon(item.type) }}
          .ml-4 {{ item.name }}
      template(v-slot:item.serving="{ item }")
        .diet-table__table__serving {{ item.serving.value }} {{ $t(`health.common.units.${item.serving.unit}`)}}

</template>

<script>
import DietItem from '../models/diet-item';

export default {
  props: {
    loading: Boolean,
    selectable: Boolean,
    search: String,
    withSearch: Boolean,
    value: Array,
    items: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      searchString: this.search,
      itemKey: 'id',
      itemsPerPage: 15,
      mobileBreakpoint: 0,
      noDataText: this.$t('health.components.dietTable.noData'),
      noResultsText: this.$t('health.components.dietTable.noResults'),
      loadingText: this.$t('health.components.dietTable.loading'),
      headers: [
        { text: this.$t('health.components.dietTable.name'), value: 'name', align: 'left', width: '15rem' },
        { text: this.$t('health.components.dietTable.serving'), value: 'serving', width: '9rem' },
        { text: this.$t('health.components.dietTable.calories'), value: 'nutrition.calories', width: '7rem' },
        { text: this.$t('health.components.dietTable.carbs'), value: 'nutrition.carbs', width: '7rem' },
        { text: this.$t('health.components.dietTable.protein'), value: 'nutrition.protein', width: '7rem' },
        { text: this.$t('health.components.dietTable.fat',), value: 'nutrition.fat', width: '7rem' },
      ],
      footer: {
        itemsPerPageAllText: this.$t('health.components.dietTable.itemsPerPageAll'),
        itemsPerPageText: this.$t('health.components.dietTable.itemsPerPage'),
      },
    };
  },
  computed: {
    model: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },

  methods: {
    getItemIcon (type) {
      switch (type) {
        case DietItem.types.RECIPE: return this.$icons.mdiFoodVariant;
        case DietItem.types.FOOD: return this.$icons.mdiFoodApple;
      }
    },
  },
  mounted () {
    this.$refs.table.$on('click:row', (item) => {
      this.$emit('select', item);
    });
  },
  watch: {
    search (newValue) {
      this.searchString = newValue;
    },
    searchString (newValue) {
      this.$emit('search', newValue);
    },
  },
};
</script>

<style lang="sass">
.diet-table__table
  th:first-of-type, td:first-of-type
    padding-left: 0

  th:last-of-type, td:last-of-type
    padding-right: 0

  tr:hover
    cursor: pointer

  &--selectable
    th:first-of-type, td:first-of-type
      padding-right: 0

  &--mobile
    .v-data-table__empty-wrapper
      text-align: left

    .v-data-footer
      justify-content: space-between

      &__pagination, &__select
        margin: 0
</style>

