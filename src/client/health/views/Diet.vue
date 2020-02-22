<template lang="pug">
  .diet.view.pb-12
    v-row
      v-col
        h1 {{ $t('health.views.diet.title') }}

    v-row
      v-col.d-flex.align-end(v-if="!$vuetify.breakpoint.xs")
        v-btn.mr-4(
          color="primary"
          data-qa="views.diet.newFoodButton"
          tile
          @click="newFood()"
        ) {{ $t('health.views.diet.newFoodButton') }}
        v-btn(
          color="primary"
          data-qa="views.diet.newRecipeButton"
          tile
          @click="newRecipe()"
        ) {{ $t('health.views.diet.newRecipeButton') }}
      v-col
        v-text-field(
          v-model="searchString"
          :label="$t('health.views.diet.search')"
          :append-icon="$theme.icons.mdiMagnify"
          data-qa="views.diet.search"
          single-line
          hide-details
        )

    v-row
      v-col
        v-card
          v-card-text
            v-checkbox.ma-0(
              v-model="showFood"
              :label="$t('health.views.diet.showFood')"
              hide-details
            )
            v-checkbox.ma-0(
              v-model="showRecipes"
              :label="$t('health.views.diet.showRecipes')"
              hide-details
            )

    v-row
      v-col
        diet-table(
          :searchString="searchString"
          :items="items"
          :loading="isLoading"
          @select="openModal($event)"
        )

    food-modal(
      v-model="selectedItem && selectedItem.type === types.FOOD"
      :item="selectedItem"
      :loading="isLoading"
      :server-error-type="serverErrorType"
      @cancel="closeModal()"
      @confirm="onFoodModalConfirm($event)"
      @remove="onFoodModalRemove($event)"
    )

    recipe-modal(
      v-model="selectedItem && selectedItem.type === types.RECIPE"
      :item="selectedItem"
      :food="food"
      :loading="isLoading"
      :server-error-type="serverErrorType"
      @cancel="closeModal()"
      @confirm="onRecipeModalConfirm($event)"
      @remove="onRecipeModalRemove($event)"
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
        data-qa="views.diet.fab.newFood"
        dark
        fab
        small
        @click="newFood()"
      )
        v-icon {{ $theme.icons.mdiFoodApple }}
      v-btn(
        color="brown lighten-1"
        data-qa="views.diet.fab.newRecipe"
        dark
        fab
        small
        @click="newRecipe()"
      )
        v-icon {{ $theme.icons.mdiFoodVariant }}
</template>

<script>
import { CalculableItem } from '../models';
import { DietTable, FoodModal, RecipeModal } from '../components';

export default {
  components: {
    DietTable,
    FoodModal,
    RecipeModal,
  },
  data () {
    return {
      types: CalculableItem.types,
      isLoading: false,
      isFabActive: false,
      showFood: true,
      showRecipes: true,
      searchString: '',
      serverErrorType: '',
    };
  },
  computed: {
    food () {
      const { food } = this.$store.state.health.diet;
      return food.map(item => CalculableItem.convertFromFood(item));
    },
    items () {
      const { recipes } = this.$store.state.health.diet;
      return [
        ...(this.showFood ? this.food : []),
        ...(this.showRecipes ? recipes.map(item => CalculableItem.convertFromRecipe(item)) : []),
      ];
    },
    selectedItem: {
      get () {
        const selected = this.$route.query['selected'];

        if (selected === 'new-food') return new CalculableItem({ type: CalculableItem.types.FOOD });
        if (selected === 'new-recipe') return new CalculableItem({ type: CalculableItem.types.RECIPE });

        const item = this.items.filter(item => item.id === selected)[0];
        if (item) return new CalculableItem(item);

        // this.$router.clearQuery('selected');
        return null;
      },
      set (newValue) {
        const { id, type } = newValue || {};
        const query = {};

        if (id) query['selected'] = id;
        else if (type === CalculableItem.types.FOOD) query['selected'] = 'new-food';
        else if (type === CalculableItem.types.RECIPE) query['selected'] = 'new-recipe';
        else query['selected'] = null;

        this.$router.pushQuery(query);
      },
    },
  },

  methods: {
    newFood () {
      this.openModal({ type: CalculableItem.types.FOOD });
    },
    newRecipe () {
      this.openModal({ type: CalculableItem.types.RECIPE });
    },

    openModal (item) {
      this.selectedItem = item;
    },
    closeModal () {
      this.selectedItem = null;
    },

    async onFoodModalConfirm (item) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('health/diet/saveFood', item);
        this.$store.dispatch('core/notify/success', this.$t('health.views.diet.notifications.food.success'));
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

    async onRecipeModalConfirm (item) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('health/diet/saveRecipe', item);
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
      this.isLoading = false;
    },
    async onRecipeModalRemove (item) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('health/diet/removeRecipe', item);
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
      this.isLoading = false;
    },

    async fetchItems () {
      this.isLoading = true;
      await this.$store.dispatch('health/diet/fetchItems');
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
