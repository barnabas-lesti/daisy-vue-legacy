<template lang="pug">
  .diet-table
    v-data-table.diet-table__table(
      :class="{ 'diet-table__table--mobile': $vuetify.breakpoint.xs }"
      :loading="loading"
      :items="items"
      :search="search"
      :headers="headers"
      :item-key="itemKey"
      :items-per-page="itemsPerPage"
      :no-data-text="noDataText"
      :no-results-text="noResultsText"
      :loading-text="loadingText"
      :mobile-breakpoint="mobileBreakpoint"
      :footer-props="footer"
      ref="table"
      data-qa="health.diet.table"
    )
      template(v-slot:item.type="{ item }")
        v-icon(:data-qa="`health.diet.table.icon.${item.type}`") {{ getItemIcon(item.type) }}
      template(v-slot:item.serving="{ item }")
        .diet-table__table__serving {{ item.serving.value }} {{ $t(`health.common.units.${item.serving.unit}`)}}

</template>

<script>
import CalculatorItem from '../../models/calculator-item';

export default {
  props: {
    loading: Boolean,
    value: String,
    items: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      itemKey: 'id',
      itemsPerPage: 15,
      mobileBreakpoint: 0,
      noDataText: this.$t('health.components.dietTable.noData'),
      noResultsText: this.$t('health.components.dietTable.noResults'),
      loadingText: this.$t('health.components.dietTable.loading'),
      headers: [
        { text: this.$t('health.components.dietTable.name'), value: 'name', align: 'left' },
        { text: this.$t('health.components.dietTable.serving'), value: 'serving' },
        { text: this.$t('health.components.dietTable.calories'), value: 'nutrition.calories' },
        { text: this.$t('health.components.dietTable.carbs'), value: 'nutrition.carbs' },
        { text: this.$t('health.components.dietTable.protein'), value: 'nutrition.protein' },
        { text: this.$t('health.components.dietTable.fat',), value: 'nutrition.fat' },
        { text: this.$t('health.components.dietTable.type'), value: 'type' },
      ],
      footer: {
        itemsPerPageAllText: this.$t('health.components.dietTable.itemsPerPageAll'),
        itemsPerPageText: this.$t('health.components.dietTable.itemsPerPage'),
      },
    };
  },
  computed: {
    search: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },

  methods: {
    getItemIcon (type) {
      switch (type) {
        case CalculatorItem.types.RECIPE: return this.$icons.mdiFoodVariant;
        case CalculatorItem.types.FOOD: return this.$icons.mdiFoodApple;
      }
    },
  },
  mounted () {
    this.$refs.table.$on('click:row', (item) => {
      this.$emit('select', item);
    });
  },
};
</script>

<style lang="sass">
.diet-table__table
  &__serving
    min-width: 7rem

  th:first-of-type, td:first-of-type
    padding-left: 0
    min-width: 12rem

  th:last-of-type, td:last-of-type
    padding-right: 0
    min-width: 4rem

  th
    min-width: 7rem

  td:first-of-type
    padding: 1rem 0

  tr:hover
    cursor: pointer

  &--mobile
    .v-data-footer
      justify-content: space-between

      &__pagination, &__select
        margin: 0
</style>
