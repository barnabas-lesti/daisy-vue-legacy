<template lang="pug">
  .diet-table(data-qa="health.components.dietTable")
    v-text-field.mb-4(
      v-if="withSearch"
      v-model="localSearchString"
      :label="$t('health.components.dietTable.search')"
      :append-icon="$theme.icons.mdiMagnify"
      data-qa="health.components.dietTable.search"
      single-line
      hide-details
    )
    v-data-table.diet-table__table(
      v-model="localValue"
      :class="{ 'diet-table__table--mobile': $vuetify.breakpoint.xs, 'diet-table__table--selectable': selectable }"
      :loading="loading"
      :items="items"
      :search="localSearchString"
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
      @item-selected="onSelect($event)"
    )
      template(v-slot:header.name="{ header }")
        span.pl-10 {{ header.text }}
      template(v-slot:item.name="{ item }")
        .d-flex.align-center.py-2
          v-icon(
            :color="getItemColor(item.type)"
            :data-qa="`health.components.dietTable.icon.${item.type}`"
          ) {{ getItemIcon(item.type) }}
          .ml-4 {{ item.name }}
      template(v-slot:item.serving="{ item }")
        span {{ item.serving.value }} {{ $t(`health.common.units.${item.serving.unit}`)}}
      template(
        v-slot:item.amount="{ item }"
      )
        template(v-if="!readonly")
          v-edit-dialog(
            @save="onAmountSave(item)"
            @cancel="onAmountCancel(item)"
          )
            v-chip(
              color="grey lighten-2"
              label
              link
            ) {{ item.amount }} {{ $t(`health.common.units.${item.serving.unit}`)}}
            template(v-slot:input)
              v-text-field(
                v-model="item.amount"
                type="number"
                single-line
              )
        template(v-else) {{ item.amount }} {{ $t(`health.common.units.${item.serving.unit}`)}}
      template(v-slot:item.nutrients.calories="{ item }") {{ formatNutrient(item, item.getNutrients().calories) }}
      template(v-slot:item.nutrients.carbs="{ item }") {{ formatNutrient(item, item.getNutrients().carbs) }}
      template(v-slot:item.nutrients.protein="{ item }") {{ formatNutrient(item, item.getNutrients().protein) }}
      template(v-slot:item.nutrients.fat="{ item }") {{ formatNutrient(item, item.getNutrients().fat) }}
</template>

<script>
import CalculableItem from '../models/calculable-item';

export default {
  props: {
    loading: Boolean,
    selectable: Boolean,
    withAmount: Boolean,
    withSearch: Boolean,
    withoutServing: Boolean,
    readonly: Boolean,

    searchString: String,
    value: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      localSearchString: this.searchString,
      itemKey: 'id',
      itemsPerPage: 15,
      mobileBreakpoint: 0,
      noDataText: this.$t('health.components.dietTable.noData'),
      noResultsText: this.$t('health.components.dietTable.noResults'),
      loadingText: this.$t('health.components.dietTable.loading'),
      headers: [
        { text: this.$t('health.components.dietTable.name'), value: 'name', align: 'left', width: '15rem' },
        ...(this.withAmount
          ? [{ text: this.$t('health.components.dietTable.amount'), value: 'amount', width: '9rem' }] : []
        ),
        ...(!this.withoutServing
          ? [{ text: this.$t('health.components.dietTable.serving'), value: 'serving', width: '9rem' }] : []
        ),
        { text: this.$t('health.components.dietTable.calories'), value: 'nutrients.calories', width: '7rem' },
        { text: this.$t('health.components.dietTable.carbs'), value: 'nutrients.carbs', width: '7rem' },
        { text: this.$t('health.components.dietTable.protein'), value: 'nutrients.protein', width: '7rem' },
        { text: this.$t('health.components.dietTable.fat',), value: 'nutrients.fat', width: '7rem' },
      ],
      footer: {
        itemsPerPageAllText: this.$t('health.components.dietTable.itemsPerPageAll'),
        itemsPerPageText: this.$t('health.components.dietTable.itemsPerPage'),
      },
    };
  },
  computed: {
    localValue: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },

  methods: {
    applyAmount (item, nutrient) {
      const mulitplier = item.amount / item.serving.value;
      return nutrient * mulitplier;
    },
    formatNutrient (item, nutrient) {
      nutrient = this.withAmount ? this.applyAmount(item, nutrient) : nutrient;
      return parseFloat(nutrient).toFixed(2);
    },

    getItemColor (type) {
      switch (type) {
        case CalculableItem.types.RECIPE: return 'brown lighten-2';
        case CalculableItem.types.FOOD: return 'green lighten-2';
      }
    },
    getItemIcon (type) {
      switch (type) {
        case CalculableItem.types.RECIPE: return this.$theme.icons.mdiFoodVariant;
        case CalculableItem.types.FOOD: return this.$theme.icons.mdiFoodApple;
      }
    },

    onAmountSave (item) {
      item.amount = parseFloat(item.amount || 0);
      this.localValue = [...this.localValue.filter(subject => subject.id !== item.id), item];
    },
    onAmountCancel (item) {
      item.amount = item.serving.value;
    },

    onSelect ({ item }) {
      this.$emit('select', item);
    },
  },
  mounted () {
    this.$refs.table.$on('click:row', (item, props) => {
      props.select(!props.isSelected);
    });
  },
  watch: {
    searchString (newValue) {
      this.localSearchString = newValue;
    },
    localSearchString (newValue) {
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
