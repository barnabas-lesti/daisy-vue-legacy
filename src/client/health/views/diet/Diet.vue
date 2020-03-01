<template lang="pug">
  .diet.view.pb-12
    v-row
      v-col
        h1 {{ $t('health.views.diet.title') }}

    v-row
      v-col.d-flex.align-end(v-if="!$vuetify.breakpoint.xs")
        v-btn.diet__new-food.mr-4.green.lighten-1.white--text(
          small
          fab
          @click="newFood()"
        )
          v-icon {{ $theme.icons.mdiFoodApple }}
        v-btn.diet__new-recipe.brown.lighten-1.white--text(
          small
          fab
          @click="newRecipe()"
        )
          v-icon {{ $theme.icons.mdiFoodVariant }}
      v-col
        diet-table-filters(
          v-model="searchString"
        )

    v-row
      v-col
        diet-table(
          :searchString="searchString"
          :items="items"
          single-select
          @select="openModal($event)"
        )

    food-modal(
      v-model="selectedItem && selectedItem.itemType === itemTypes.FOOD"
      :item="selectedItem"
      :loading="loading"
      :server-error-type="serverErrorType"
      @cancel="closeModal()"
      @confirm="onFoodModalConfirm($event)"
      @remove="onFoodModalRemove($event)"
    )

    recipe-modal(
      v-model="selectedItem && selectedItem.itemType === itemTypes.RECIPE"
      :item="selectedItem"
      :foods="foods"
      :loading="loading"
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
        v-btn.diet__fab.primary(
          v-model="isFabActive"
          fab
          large
        )
          v-icon(v-if="isFabActive") {{ $theme.icons.mdiClose }}
          v-icon(v-else) {{ $theme.icons.mdiDotsVertical }}
      v-btn.diet__fab__new-food.green.lighten-1.white--text(
        fab
        @click="newFood()"
      )
        v-icon {{ $theme.icons.mdiFoodApple }}
      v-btn.diet__fab__new-recipe.brown.lighten-1.white--text(
        fab
        @click="newRecipe()"
      )
        v-icon {{ $theme.icons.mdiFoodVariant }}
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import DietItem from '../../models/diet-item';
import DietTable from '../../components/DietTable';
import DietTableFilters from '../../components/DietTableFilters';
import FoodModal from '../../components/FoodModal';
import RecipeModal from '../../components/RecipeModal';

const modalModes = {
  NEW_FOOD: 'new-food',
  NEW_RECIPE: 'new-recipe',
};

export default {
  components: {
    DietTable,
    FoodModal,
    RecipeModal,
    DietTableFilters,
  },
  data () {
    return {
      itemTypes: DietItem.itemTypes,
      isFabActive: false,
      searchString: '',
      serverErrorType: '',
    };
  },
  computed: {
    ...mapState('health', {
      foods: state => state.diet.foods.map(food => DietItem.convertFromFood(food)),
    }),
    ...mapGetters('core', [ 'loading' ]),
    ...mapGetters('health', {
      items: 'diet/items',
    }),

    selectedItem: {
      get () {
        const selected = this.$route.query['selected'];
        switch (selected) {
          case modalModes.NEW_FOOD: return new DietItem({ itemType: DietItem.itemTypes.FOOD });
          case modalModes.NEW_RECIPE: return new DietItem({ itemType: DietItem.itemTypes.RECIPE });
          default:
            const item = this.items.filter(item => item.id === selected)[0];
            if (item) {
              return item;
            } else {
              this.$router.clearQuery('selected');
              return null;
            }
        }
      },
      set (newValue) {
        let selected = null;
        const { id, itemType } = newValue || {};
        if (id) selected = id;
        else if (itemType === DietItem.itemTypes.FOOD) selected = modalModes.NEW_FOOD;
        else if (itemType === DietItem.itemTypes.RECIPE) selected = modalModes.NEW_RECIPE;
        this.$router.pushQuery({ 'selected': selected });
      },
    },
  },

  methods: {
    newFood () {
      this.openModal({ itemType: DietItem.itemTypes.FOOD });
    },
    newRecipe () {
      this.openModal({ itemType: DietItem.itemTypes.RECIPE });
    },

    openModal (item) {
      this.selectedItem = item;
    },
    closeModal () {
      this.selectedItem = null;
    },

    async onFoodModalConfirm (item) {
      try {
        await this.$store.dispatch('health/diet/saveFood', item);
        this.$store.dispatch('core/notify/success', this.$t('health.views.diet.notifications.food.saved'));
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
    },
    async onFoodModalRemove (item) {
      try {
        await this.$store.dispatch('health/diet/removeFood', item);
        this.$store.dispatch('core/notify/success', this.$t('health.views.diet.notifications.food.removed'));
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
    },

    async onRecipeModalConfirm (item) {
      try {
        await this.$store.dispatch('health/diet/saveRecipe', item);
        this.$store.dispatch('core/notify/success', this.$t('health.views.diet.notifications.recipe.saved'));
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
    },
    async onRecipeModalRemove (item) {
      try {
        await this.$store.dispatch('health/diet/removeRecipe', item);
        this.$store.dispatch('core/notify/success', this.$t('health.views.diet.notifications.recipe.removed'));
        this.closeModal();
      } catch ({ error }) {
        this.serverErrorType = 'unknown';
      }
    },
  },
};
</script>
