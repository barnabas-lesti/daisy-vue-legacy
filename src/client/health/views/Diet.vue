<template lang="pug">
  .diet.view
    v-row
      v-col
        h1 {{ $t('health.views.diet.title') }}

    v-row
      v-col.d-flex.align-end(v-if="!$vuetify.breakpoint.xs")
        v-btn(
          color="primary"
          data-qa="views.diet.food.create"
          tile
          @click="newFood()"
        ) {{ $t('health.views.diet.newButton') }}
      v-col
        v-text-field(
          v-model="search"
          :label="$t('health.views.diet.search')"
          :append-icon="$theme.icons.mdiMagnify"
          data-qa="views.diet.search"
          single-line
          hide-details
        )

    v-row
      v-col
        diet-table(
          :search="search"
          :items="items"
          :loading="isLoading"
          @select="openModal($event)"
        )

    food-modal(
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
      v-model="isFabActive"
      bottom
      right
      fixed
    )
      template(v-slot:activator)
        v-btn(
          v-model="isFabActive"
          color="primary"
          data-qa="views.diet.fab"
          fab
        )
          v-icon(v-if="isFabActive") {{ $theme.icons.mdiClose}}
          v-icon(v-else) {{ $theme.icons.mdiPlus }}
      v-btn(
        color="green lighten-1"
        data-qa="views.diet.fab.createFood"
        dark
        fab
        small
        @click="newFood()"
      )
        v-icon {{ $theme.icons.mdiFoodApple }}
</template>

<script>
import { DietItem } from '../models';
import { DietTable, FoodModal } from '../components';

export default {
  components: {
    FoodModal,
    DietTable,
  },
  data () {
    return {
      types: DietItem.types,
      isLoading: false,
      isFabActive: false,
      search: '',
      selection: null,
      serverErrorType: '',
    };
  },
  computed: {
    items () {
      const { food, recipes } = this.$store.state.health.diet;
      return [
        ...(food.map(item => DietItem.convertFromFood(item))),
        ...(recipes.map(item => DietItem.convertFromRecipe(item))),
      ];
    },
  },

  methods: {
    newFood () {
      this.openModal(new DietItem({ type: DietItem.types.FOOD }));
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
