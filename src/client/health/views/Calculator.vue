<template lang="pug">
  .calculator.view
    v-row
      v-col
        h1 {{ $t('health.views.calculator.title') }}

    v-row(v-if="summary")
      v-col
        nutrients-chart.calculator__summary(:nutrients="summary")

    v-row
      v-col.d-flex.align-end(v-if="!$vuetify.breakpoint.xs")
        v-btn.calculator__change-items(
          color="primary"
          tile
          @click="openSelectModal()"
        ) {{ $t('health.views.calculator.changeItems') }}
      v-col
        v-text-field(
          v-model="calculatorSearch"
          :label="$t('health.views.calculator.search')"
          :append-icon="$theme.icons.mdiMagnify"
          single-line
          hide-details
        )

    v-row
      v-col
        diet-table.calculator__table(
          :search-string="calculatorSearch"
          :items="calculatorItems"
          :loading="isLoading"
          with-amount
          without-serving
          @select="onCalculatorTableSelect($event)"
          @item:change="onCalculatorItemChange($event)"
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
      :edit-route="getEditRoute(selectedItem)"
      readonly
      @cancel="closeModal()"
      @remove="onCalculatorItemRemove($event)"
    )

    recipe-modal(
      v-model="selectedItem && selectedItem.type === types.RECIPE"
      :item="selectedItem"
      :edit-route="getEditRoute(selectedItem)"
      readonly
      @cancel="closeModal()"
      @remove="onCalculatorItemRemove($event)"
    )

    v-btn.calculator__fab(
      v-if="$vuetify.breakpoint.xs"
      color="primary"
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
import { DietTable, FoodModal, NutrientsChart, SelectModal, RecipeModal } from '../components';

export default {
  components: {
    DietTable,
    FoodModal,
    NutrientsChart,
    SelectModal,
    RecipeModal,
  },
  data () {
    return {
      types: CalculableItem.types,
      isLoading: false,
      isSelectModalOpen: false,

      calculatorSearch: '',
      selectedItems: [],
    };
  },
  computed: {
    dietItems () {
      return this.$store.getters['health/diet/items'];
    },
    calculatorItems () {
      return this.$store.getters['health/calculator/items'];
    },
    summary () {
      return this.$store.getters['health/calculator/summary'];
    },
    selectedItem: {
      get () {
        if (this.$store.getters['health/diet/areItemsLoaded']) {
          const selected = this.$route.query['selected'];
          const item = this.calculatorItems.filter(item => item.id === selected)[0];
          if (item) return new CalculableItem(item);

          this.$router.clearQuery('selected');
        }

        return null;
      },
      set (newValue) {
        const { id } = newValue || {};
        const query = {};

        if (id) query['selected'] = id;
        else query['selected'] = null;

        this.$router.pushQuery(query);
      },
    },
  },
  methods: {
    onCalculatorTableSelect (item) {
      this.selectedItem = item;
    },
    onCalculatorItemChange (item) {
      this.$store.dispatch('health/calculator/updateItem', item);
    },
    onCalculatorItemRemove (item) {
      this.$store.dispatch('health/calculator/removeItem', item);
    },

    closeModal () {
      this.selectedItem = null;
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

    getEditRoute (item) {
      if (!item) return null;
      return { name: 'health.diet', query: { 'selected': item.id } };
    },

    async fetchDietItems () {
      this.isLoading = true;
      await this.$store.dispatch('health/diet/fetchItems');
      this.isLoading = false;
    },
  },
  created () {
    if (!this.dietItems || !this.dietItems.length) {
      this.fetchDietItems();
    }
  },
};
</script>
