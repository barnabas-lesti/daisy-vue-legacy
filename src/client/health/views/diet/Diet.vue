<template lang="pug">
  .diet.view
    v-row
      v-col
        h1 {{ $t('health.views.diet.title') }}

    v-row
      v-col.d-flex.align-end(v-if="!$vuetify.breakpoint.xs")
        v-btn(
          color="primary"
          data-qa="health.diet.food.create"
          tile
          @click="newFood()"
        ) {{ $t('health.views.diet.newButton') }}
      v-col
        v-text-field(
          v-model="search"
          :label="$t('health.views.diet.search')"
          :append-icon="$icons.mdiMagnify"
          data-qa="health.diet.search"
          single-line
          hide-details
        )

    v-row
      v-col
        diet-table(
          v-model="search"
          :items="items"
          :loading="isLoading"
          @select="openModal($event)"
        )

    diet-food-modal(
      v-model="selection && selection.type === types.FOOD"
      :item="selection"
      :loading="isLoading"
      :server-error-type="serverErrorType"
      @cancel="closeModal()"
      @confirm="onFoodModalConfirm($event)"
      @remove="onFoodModalRemove($event)"
    )

    v-speed-dial(
      v-if="$vuetify.breakpoint.xs"
      v-model="fab"
      bottom
      right
      fixed
    )
      template(v-slot:activator)
        v-btn(
          v-model="fab"
          color="primary"
          data-qa="health.diet.fab"
          fab
        )
          v-icon(v-if="fab") {{ $icons.mdiClose}}
          v-icon(v-else) {{ $icons.mdiPlus }}
      v-btn(
        color="green"
        data-qa="health.diet.fab.food.create"
        dark
        fab
        small
        @click="newFood()"
      )
        v-icon {{ $icons.mdiFoodApple }}
</template>

<script>
import CalculatorItem from '../../models/calculator-item';

import DietFoodModal from './DietFoodModal.vue';
import DietTable from './DietTable.vue';

export default {
  components: {
    DietFoodModal,
    DietTable,
  },
  data () {
    return {
      types: CalculatorItem.types,
      isLoading: false,
      search: '',
      selection: null,
      fab: null,
      serverErrorType: '',
    };
  },
  computed: {
    items () {
      const { food, recipes } = this.$store.state.health.diet;
      return [
        ...(food.map(item => CalculatorItem.convertFromFood(item))),
        ...(recipes.map(item => CalculatorItem.convertFromRecipe(item))),
      ];
    },
  },

  methods: {
    newFood () {
      this.openModal(new CalculatorItem({ type: CalculatorItem.types.FOOD }));
    },
    openModal (item) {
      this.selection = item;
    },
    closeModal () {
      this.selection = null;
    },
    async onFoodModalConfirm (item) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('health/diet/saveFood', item);
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
      this.isLoading = false;
    },

    async onFoodModalRemove (item) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('health/diet/removeFood', item);
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
      this.isLoading = false;
    },

    async fetchItems () {
      this.isLoading = true;
      await Promise.all([
        this.$store.dispatch('health/diet/fetchFood'),
        this.$store.dispatch('health/diet/fetchRecipes'),
      ]);
      this.isLoading = false;
    },
  },

  created () {
    if (!this.items || !this.items.length) {
      this.fetchItems();
    }
  },
};
</script>
