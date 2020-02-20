<template lang="pug">
  modal.diet-food-modal(
    v-model="value"
    :title="$t(`health.components.editFoodModal.${ form && form.id ? 'editTitle' : 'newTitle' }`)"
    :loading="loading"
    :with-remove="form && !!form.id"
    @cancel="cancel()"
    @confirm="confirm()"
    @remove="remove()"
  )
    v-form(
      v-if="form"
      ref="form"
      data-qa="views.diet.food.form"
      @submit.prevent="confirm()"
    )
      .red--text.mb-4(v-if="serverErrorType")
        | {{ $t(`health.components.editFoodModal.errors.server.${serverErrorType}`) }}
      v-text-field(
        v-model="form.name"
        :label="$t('health.components.editFoodModal.form.name')"
        :rules="rules.name"
        name="name"
        data-qa="views.diet.food.form.name"
      )
      v-text-field(
        v-model="form.description"
        :label="$t('health.components.editFoodModal.form.description')"
        name="description"
        data-qa="views.diet.food.form.description"
      )
      .diet-food-modal__serving
        v-text-field(
          v-model="form.serving.value"
          :label="$t('health.components.editFoodModal.form.serving.value')"
          name="servingValue"
          data-qa="views.diet.food.form.serving.value"
        )
        .diet-food-modal__serving__unit(data-qa="views.diet.food.form.serving.unit")
          v-select(
            v-model="form.serving.unit"
            :items="units"
            :label="$t('health.components.editFoodModal.form.serving.unit')"
            name="servingUnit"
          )
      v-text-field(
        v-model="form.nutrition.calories"
        :label="$t('health.components.editFoodModal.form.calories')"
        name="calories"
        type="number"
        data-qa="views.diet.food.form.calories"
      )
      v-text-field(
        v-model="form.nutrition.carbs"
        :label="$t('health.components.editFoodModal.form.carbs')"
        name="carbs"
        type="number"
        data-qa="views.diet.food.form.carbs"
      )
      v-text-field(
        v-model="form.nutrition.protein"
        :label="$t('health.components.editFoodModal.form.protein')"
        name="protein"
        type="number"
        data-qa="views.diet.food.form.protein"
      )
      v-text-field(
        v-model="form.nutrition.fat"
        :label="$t('health.components.editFoodModal.form.fat')"
        name="fat"
        type="number"
        data-qa="views.diet.food.form.fat"
      )
      v-btn.d-none(type="submit")

</template>

<script>
import Modal from '../../../core/components/Modal.vue';
import Food from '../../models/food';

export default {
  components: {
    Modal,
  },
  props: {
    value: Boolean,
    item: Object,
    loading: Boolean,
    serverErrorType: String,
  },
  data () {
    return {
      form: null,
      units: Food.unitValues.map(value => ({ text: this.$t(`health.common.units.${value}`), value })),
      rules: {
        name: [ v => !!v || this.$t('health.components.editFoodModal.errors.name.required') ],
      },
    };
  },
  methods: {
    cancel () {
      this.$emit('cancel');
    },
    confirm () {
      if (this.$refs.form.validate()) this.$emit('confirm', this.form);
    },
    remove () {
      this.$emit('remove', this.form);
    },
  },
  watch: {
    item (newValue) { this.form = newValue ? Object.assign({}, newValue) : null; },
  },
};
</script>

<style lang="sass">
.diet-food-modal
  &__serving
    display: flex

    &__unit
      max-width: 7rem
      margin-left: 1rem

</style>
