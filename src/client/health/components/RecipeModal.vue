<template lang="pug">
  modal.recipe-modal(
    v-model="isOpen"
    :title="title"
    :loading="loading"
    :headerColor="headerColor"
    :readonly="readonly"
    :with-remove="localItem && !!localItem.id"
    @cancel="cancel()"
    @confirm="confirm()"
    @remove="remove()"
  )
    template(v-if="localItem")
      v-row
        v-col
          v-form(
            ref="form"
            data-qa="components.recipeModal.form"
            @submit.prevent="confirm()"
          )
            .red--text.mb-4(v-if="serverErrorType")
              | {{ $t(`health.components.recipeModal.errors.server.${serverErrorType}`) }}
            v-text-field(
              v-model="localItem.name"
              :label="$t('health.components.recipeModal.form.name')"
              :rules="rules.name"
              :readonly="readonly"
              name="name"
              data-qa="components.recipeModal.form.name"
            )
            v-text-field(
              v-model="localItem.description"
              :label="$t('health.components.recipeModal.form.description')"
              :readonly="readonly"
              name="description"
              data-qa="components.recipeModal.form.description"
            )
            .recipe-modal__serving
              v-text-field(
                v-model="localItem.serving.value"
                :label="$t('health.components.recipeModal.form.serving.value')"
                :readonly="readonly"
                name="servingValue"
                data-qa="components.recipeModal.form.serving.value"
              )
              .recipe-modal__serving__unit(data-qa="components.recipeModal.form.serving.unit")
                v-select(
                  v-model="localItem.serving.unit"
                  :items="units"
                  :label="$t('health.components.recipeModal.form.serving.unit')"
                  :readonly="readonly"
                  name="servingUnit"
                )
            v-btn.d-none(
              v-if="!readonly"
              type="submit"
            )

      v-row
        v-col
          template(v-if="!readonly")
            v-divider
            v-expansion-panels(
              flat
              tile
              hover
            )
              v-expansion-panel
                v-expansion-panel-header.px-2 {{ $t('health.components.recipeModal.food') }}
                v-expansion-panel-content
                  v-checkbox.ma-0(
                    v-model="onlyShowSelected"
                    :label="$t('health.components.recipeModal.onlyShowSelected')"
                    hide-details
                  )
                  diet-table(
                    v-model="ingredients"
                    :items="localFood"
                    with-amount
                    without-serving
                    with-search
                    selectable
                  )
          v-divider
          v-expansion-panels(
            :value="readonly ? 0 : undefined"
            flat
            tile
            hover
          )
            v-expansion-panel
              v-expansion-panel-header.px-2 {{ $t('health.components.recipeModal.ingredients') }}
              v-expansion-panel-content
                diet-table(
                  :items="ingredients"
                  :with-search="ingredients && ingredients.length > 15"
                  with-amount
                  without-serving
                  readonly
                )
          v-divider
          v-expansion-panels(
            :value="0"
            flat
            tile
            hover
          )
            v-expansion-panel
              v-expansion-panel-header.px-2 {{ $t('health.components.recipeModal.nutrients') }}
              v-expansion-panel-content
                nutrients-chart(
                  v-if="localItem.ingredients.length"
                  :nutrients="localItem.getNutrients()"
                )
                .text-center.mt-4(v-else) {{ $t('health.components.recipeModal.noIngredients') }}

</template>

<script>
import { Food, Recipe, CalculableItem } from '../models';
import { Modal } from '../../core/components';
import { DietTable, NutrientsChart } from '../components';

export default {
  components: {
    Modal,
    NutrientsChart,
    DietTable,
  },
  props: {
    loading: Boolean,
    serverErrorType: String,
    headerColor: String,
    readonly: Boolean,

    value: Boolean,
    item: Object,
    food: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      onlyShowSelected: false,
      localItem: new CalculableItem({ type: CalculableItem.types.RECIPE }),
      units: Food.unitValues.map(value => ({ text: this.$tc(`health.common.units.${value}`, 2), value })),
      rules: {
        name: [ v => !!v || this.$t('health.components.recipeModal.errors.name.required') ],
      },
    };
  },
  computed: {
    title () {
      const prefix = 'health.components.recipeModal.';
      if (this.readonly) return this.$t(prefix + 'title.view');
      if (this.localItem && this.localItem.id) return this.$t(prefix + 'title.edit');
      return this.$t(prefix + 'title.new');
    },
    isOpen: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
    localFood () {
      if (this.onlyShowSelected) {
        const selectedIds = this.ingredients.map(item => item.id);
        return [...this.food.filter(item => selectedIds.indexOf(item.id) !== -1)];
      } else {
        return [...this.food];
      }
    },
    ingredients: {
      get () {
        return this.localItem.ingredients.map(item => CalculableItem.convertFromIngredient(item));
      },
      set (newValue) {
        this.localItem.ingredients = newValue.map(item => {
          const { amount, ...food } = item;
          return new Recipe.Ingredient({ amount, food });
        });
      },
    },
  },
  methods: {
    cancel () {
      this.$emit('cancel');
    },
    confirm () {
      if (!this.readonly && this.$refs.form.validate()) this.$emit('confirm', this.localItem);
    },
    remove () {
      if (!this.readonly) this.$emit('remove', this.localItem);
    },
  },
  watch: {
    item (newValue) { this.localItem = newValue ? CalculableItem.convertFromRecipe(Object.assign({}, newValue)) : null; },
  },
};
</script>

<style lang="sass">
.recipe-modal
  &__serving
    display: flex

    &__unit
      max-width: 7rem
      margin-left: 1rem

.v-expansion-panel-content__wrap
  padding-right: 8px
  padding-left: 8px

</style>
