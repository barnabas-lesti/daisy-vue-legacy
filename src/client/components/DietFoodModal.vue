<template lang="pug">
  common-modal.diet-food-modal(
    v-model="isOpen"
    :title="title"
    :loading="loading"
    :headerColor="headerColor"
    :readonly="readonly"
    :with-remove="localItem && !!localItem.id"
    :content-class="contentClass"
    @cancel="cancel()"
    @confirm="confirm()"
    @remove="remove()"
  )
    v-form.diet-food-modal__form(
      v-if="localItem"
      ref="form"
      @submit.prevent="confirm()"
    )
      .red--text.mb-4(v-if="serverErrorType")
        | {{ $t(`components.dietFoodModal.errors.server.${serverErrorType}`) }}
      v-text-field(
        v-model="localItem.name"
        :label="$t('components.dietFoodModal.form.name')"
        :rules="rules.name"
        :readonly="readonly"
        name="name"
      )
      v-text-field(
        v-model="localItem.description"
        :label="$t('components.dietFoodModal.form.description')"
        :readonly="readonly"
        name="description"
      )
      .diet-food-modal__form__serving
        v-text-field(
          v-model="localItem.serving.value"
          :label="$t('components.dietFoodModal.form.serving.value')"
          :readonly="readonly"
          name="servingValue"
        )
        .diet-food-modal__form__serving__unit
          v-select(
            v-model="localItem.serving.unit"
            :items="units"
            :label="$t('components.dietFoodModal.form.serving.unit')"
            :readonly="readonly"
            name="servingUnit"
          )
      v-text-field(
        v-model="localItem.nutrients.calories"
        :label="$t('components.dietFoodModal.form.calories')"
        :readonly="readonly"
        name="calories"
        type="number"
      )
      v-text-field(
        v-model="localItem.nutrients.carbs"
        :label="$t('components.dietFoodModal.form.carbs')"
        :readonly="readonly"
        name="carbs"
        type="number"
      )
      v-text-field(
        v-model="localItem.nutrients.protein"
        :label="$t('components.dietFoodModal.form.protein')"
        :readonly="readonly"
        name="protein"
        type="number"
      )
      v-text-field(
        v-model="localItem.nutrients.fat"
        :label="$t('components.dietFoodModal.form.fat')"
        :readonly="readonly"
        name="fat"
        type="number"
      )
      v-btn.d-none(
        v-if="!readonly"
        type="submit"
      )
</template>

<script>
import Food from '../models/food';
import CommonModal from './CommonModal';

export default {
  components: {
    CommonModal,
  },
  props: {
    loading: Boolean,
    headerColor: String,
    readonly: Boolean,
    serverErrorType: String,
    value: Boolean,
    item: Object,
    contentClass: String,
  },
  data () {
    return {
      localItem: this.item ? new Food(this.item) : null,
      units: Food.unitValues.map(value => ({ text: this.$tc(`common.units.${value}`, 2), value })),
      rules: {
        name: [ v => !!v || this.$t('components.dietFoodModal.errors.name.required') ],
      },
    };
  },
  computed: {
    title () {
      const prefix = 'components.dietFoodModal.';
      if (this.readonly) return this.$t(prefix + 'title.view');
      if (this.localItem && this.localItem.id) return this.$t(prefix + 'title.edit');
      return this.$t(prefix + 'title.new');
    },
    isOpen: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
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
      this.$emit('remove', this.localItem);
    },
  },
  watch: {
    'item' (newValue) { this.localItem = newValue ? new Food(newValue) : null; },
  },
};
</script>

<style lang="sass">
.diet-food-modal
  &__form
    &__serving
      display: flex

      &__unit
        max-width: 7rem
        margin-left: 1rem
</style>
