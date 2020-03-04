<template lang="pug">
  .diet-table
    v-data-table.diet-table__table(
      v-model="localValue"
      :class="{ 'diet-table__table--mobile': $vuetify.breakpoint.xs, 'diet-table__table--selectable': selectable }"
      :loading="loading"
      :items="localItems"
      :search="localSearchString"
      :headers="headers"
      :no-data-text="$t('health.components.dietTable.noData')"
      :no-results-text="$t('health.components.dietTable.noResults')"
      :loading-text="$t('health.components.dietTable.loading')"
      :items-per-page="perPage"
      :mobile-breakpoint="0"
      item-key="id"
      :footer-props="footer"
      :show-select="selectable"
      sort-by="name"
      must-sort
      ref="table"
      :single-select="singleSelect"
      @item-selected="onSelect($event)"
    )
      template(v-slot:header.name="{ header }")
        span.pl-10 {{ header.text }}
      template(v-slot:item.name="{ item }")
        .d-flex.align-center.py-2
          v-icon(
            :color="getItemColor(item.itemType)"
            :data-item-type="item.itemType"
          ) {{ getItemIcon(item.itemType) }}
          .ml-4 {{ item.name }}
      template(v-slot:item.serving.value="{ item }")
        v-chip.grey.lighten-4(
          label
          link
        ) {{ formatNumber(item.serving.value) }} {{ $tc(`health.common.units.${item.serving.unit}`, item.serving.value)}}
      template(
        v-slot:item.amount="{ item }"
      )
        template(v-if="!readonly")
          v-edit-dialog(
            @save="onAmountSave(item)"
            @cancel="onAmountCancel(item)"
          )
            v-chip.diet-table__table__amount-display.grey.lighten-2(
              label
              link
            ) {{ formatNumber(item.amount) }} {{ $tc(`health.common.units.${item.serving.unit}`, item.amount)}}
            template(v-slot:input)
              v-text-field(
                v-model="item.amount"
                :data-id="item.id"
                type="number"
                name="amount"
                single-line
                autofocus
              )
        template(v-else) {{ formatNumber(item.amount) }} {{ $tc(`health.common.units.${item.serving.unit}`, item.amount)}}
      template(v-slot:item.nutrients.calories="{ item }") {{ formatNutrient(item, item.getNutrients().calories) }}
      template(v-slot:item.nutrients.carbs="{ item }") {{ formatNutrient(item, item.getNutrients().carbs) }}
      template(v-slot:item.nutrients.protein="{ item }") {{ formatNutrient(item, item.getNutrients().protein) }}
      template(v-slot:item.nutrients.fat="{ item }") {{ formatNutrient(item, item.getNutrients().fat) }}
</template>

<script>
import DietItem from '../models/diet-item';

export default {
  props: {
    loading: Boolean,
    selectable: Boolean,
    singleSelect: Boolean,
    withAmount: Boolean,
    withoutServing: Boolean,
    readonly: Boolean,
    searchString: String,
    perPage: {
      type: Number,
      default: () => 15,
    },
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
      showFoods: true,
      showRecipes: true,
      headers: [
        { text: this.$t('health.components.dietTable.name'), value: 'name', align: 'left', width: '15rem' },
        ...(this.withAmount
          ? [{ text: this.$t('health.components.dietTable.amount'), value: 'amount', width: '9rem' }] : []
        ),
        ...(!this.withoutServing
          ? [{ text: this.$t('health.components.dietTable.serving'), value: 'serving.value', width: '9rem' }] : []
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
    localItems () {
      return this.items;
    },
  },

  methods: {
    applyAmount (item, nutrient) {
      const mulitplier = item.amount / item.serving.value;
      return nutrient * mulitplier;
    },
    formatNutrient (item, nutrient) {
      nutrient = this.withAmount ? this.applyAmount(item, nutrient) : nutrient;
      return this.formatNumber(nutrient);
    },
    formatNumber (value) {
      return parseFloat(value).toFixed(2);
    },

    getItemColor (itemType) {
      switch (itemType) {
        case DietItem.itemTypes.RECIPE: return 'brown lighten-2';
        case DietItem.itemTypes.FOOD: return 'green lighten-2';
      }
    },
    getItemIcon (itemType) {
      switch (itemType) {
        case DietItem.itemTypes.RECIPE: return this.$theme.icons.mdiFoodVariant;
        case DietItem.itemTypes.FOOD: return this.$theme.icons.mdiFoodApple;
      }
    },

    onAmountSave (item) {
      item.amount = parseFloat(item.amount || 0);
      this.localValue = [...this.localValue.filter(subject => subject.id !== item.id), item];
      this.$emit('item:change', item);
    },
    onAmountCancel (item) {
      item.amount = item.serving.value;
    },

    onSelect ({ item }) {
      this.$emit('select', item);
    },

    onRemoveClick (item) {
      this.$emit('item:remove', item);
    },
    onViewClick (item) {
      this.$emit('item:view', item);
    },
  },
  mounted () {
    this.$refs.table.$on('click:row', (item, props) => {
      props.select(!props.isSelected);
    });
  },
  watch: {
    'searchString' (newValue) {
      this.localSearchString = newValue;
    },
    'localSearchString' (newValue) {
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
