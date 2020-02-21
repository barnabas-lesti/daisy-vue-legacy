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
      v-col(data-qa="views.calculator.mainTable")
        diet-table(
          :search="calculatorSearch"
          :items="calculatorItems"
          :loading="isLoading"
          with-amount
          without-serving
          @select="onMainTableSelect($event)"
        )

    select-modal(
      v-model="isSelectModalOpen"
      :loading="isLoading"
      :source-items="sourceItems"
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
import { DietItem } from '../models';
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
      isLoading: false,
      isSelectModalOpen: false,
      calculatorSearch: '',
      sourceSearch: '',
      selectedItem: null,
      selectedItems: [],
      chartOptions: {},

      types: DietItem.types,
    };
  },
  computed: {
    sourceItems () {
      const { food, recipes } = this.$store.state.health.diet;
      return [
        ...(food.map(item => DietItem.convertFromFood(item))),
        ...(recipes.map(item => DietItem.convertFromRecipe(item))),
      ];
    },
    calculatorItems () {
      return this.$store.state.health.calculator.items;
    },
    summary () {
      return this.$store.getters['health/calculatorSummary'];
    },
  },
  methods: {
    onMainTableSelect (item) {
      this.selectedItem = item;
    },
    openSelectModal () {
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

    async fetchSourceItems () {
      this.isLoading = true;
      await Promise.all([
        this.$store.dispatch('health/diet/fetchFood'),
        this.$store.dispatch('health/diet/fetchRecipes'),
      ]);
      this.isLoading = false;
    },
  },
  created () {
    if (!this.sourceItems || !this.sourceItems.length) {
      this.fetchSourceItems();
    }
  },
};
</script>
