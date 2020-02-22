<template lang="pug">
  .calculator.view
    v-row
      v-col
        h1 {{ $t('health.views.calculator.title') }}

    v-row(v-if="summary")
      v-col
        nutrients-chart(:nutrients="summary")

    v-row
      v-col.d-flex.align-end(v-if="!$vuetify.breakpoint.xs")
        v-btn(
          color="primary"
          data-qa="views.calculator.changeItems"
          tile
          @click="openSelectModal()"
        ) {{ $t('health.views.calculator.changeItems') }}
      v-col
        v-text-field(
          v-model="calculatorSearch"
          :label="$t('health.views.calculator.search')"
          :append-icon="$theme.icons.mdiMagnify"
          data-qa="views.calculator.search"
          single-line
          hide-details
        )

    v-row
      v-col(data-qa="views.calculator.table")
        diet-table(
          :search="calculatorSearch"
          :items="calculatorItems"
          :loading="isLoading"
          with-amount
          without-serving
          @select="onCalculatorTableSelect($event)"
        )

    select-modal(
      v-model="isSelectModalOpen"
      :loading="isLoading"
      :items="dietItems"
      :selected-items="selectedItems"
      @cancel="onSelectModalCancel()"
      @confirm="onSelectModalConfirm($event)"
    )

    food-modal(
      v-model="selectedItem && selectedItem.type === types.FOOD"
      :item="selectedItem"
      :loading="isLoading"
      readonly
      @cancel="selectedItem = null;"
    )

    v-btn(
      v-if="$vuetify.breakpoint.xs"
      color="primary"
      data-qa="views.calculator.fab"
      fab
      bottom
      right
      fixed
      @click="openSelectModal()"
    )
      v-icon {{ $theme.icons.mdiPlus }}
</template>

<script>
import { CalculableItem } from '../models';
import { DietTable, FoodModal, NutrientsChart, SelectModal } from '../components';

export default {
  components: {
    DietTable,
    FoodModal,
    NutrientsChart,
    SelectModal,
  },
  data () {
    return {
      types: CalculableItem.types,
      isLoading: false,
      isSelectModalOpen: false,

      calculatorSearch: '',
      selectedItem: null,
      selectedItems: [],
    };
  },
  computed: {
    dietItems () {
      return this.$store.getters['health/dietItems'];
    },
    calculatorItems () {
      return this.$store.state.health.calculator.items;
    },
    summary () {
      return this.$store.getters['health/calculatorSummary'];
    },
  },
  methods: {
    onCalculatorTableSelect (item) {
      this.selectedItem = item;
    },

    openSelectModal () {
      if (!this.dietItems || !this.dietItems.length) {
        this.fetchDietItems();
      }

      this.selectedItems = [...this.calculatorItems];
      this.isSelectModalOpen = true;
    },
    onSelectModalCancel () {
      this.isSelectModalOpen = false;
    },
    onSelectModalConfirm (selectedItems) {
      this.$store.dispatch('health/calculator/setItems', selectedItems);
      this.isSelectModalOpen = false;
    },

    async fetchDietItems () {
      this.isLoading = true;
      await this.$store.dispatch('health/diet/fetchItems');
      this.isLoading = false;
    },
  },
};
</script>
