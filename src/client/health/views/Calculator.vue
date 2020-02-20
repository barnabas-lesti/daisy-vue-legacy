<template lang="pug">
  .calculator.view
    v-row
      v-col
        h1 {{ $t('health.views.calculator.title') }}

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
          :append-icon="$icons.mdiMagnify"
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
        )

    modal(
      v-model="isSelectModalOpen"
      :title="$t('health.views.calculator.selectModal.title')"
      :loading="isLoading"
      @cancel="onSelectModalCancel()"
      @confirm="onSelectModalConfirm()"
    )
      diet-table(
        v-model="selectedItems"
        :items="sourceItems"
        :loading="isLoading"
        selectable
        with-search
        @select="onSelect($event)"
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
      v-icon {{ $icons.mdiPlus }}
</template>

<script>
import { DietItem } from '../models';
import { Modal } from '../../core/components';
import { DietTable } from '../components';

export default {
  components: {
    Modal,
    DietTable,
  },
  data () {
    return {
      isLoading: false,
      isSelectModalOpen: false,
      calculatorSearch: '',
      sourceSearch: '',
      selectedItems: [],
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
  },
  methods: {
    onSelect (item) {
      const alreadySelected = !!this.selectedItems.filter(({ id }) => id === item.id)[0];
      if (alreadySelected) {
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== item.id);
      } else {
        this.selectedItems.push(item);
      }
    },
    openSelectModal () {
      this.selectedItems = [...this.calculatorItems];
      this.isSelectModalOpen = true;
    },
    onSelectModalCancel () {
      this.isSelectModalOpen = false;
      this.selectedItems = [];
    },
    onSelectModalConfirm () {
      this.$store.dispatch('health/calculator/setItems', this.selectedItems);
      this.selectedItems = [];
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
