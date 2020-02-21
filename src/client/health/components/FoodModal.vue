<template lang="pug">
  modal.food-modal(
    v-model="value"
    :title="title"
    :loading="loading"
    :headerColor="headerColor"
    :readonly="readonly"
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
        | {{ $t(`health.components.foodModal.errors.server.${serverErrorType}`) }}
      v-text-field(
        v-model="form.name"
        :label="$t('health.components.foodModal.form.name')"
        :rules="rules.name"
        :readonly="readonly"
        name="name"
        data-qa="views.diet.food.form.name"
      )
      v-text-field(
        v-model="form.description"
        :label="$t('health.components.foodModal.form.description')"
        :readonly="readonly"
        name="description"
        data-qa="views.diet.food.form.description"
      )
      .food-modal__serving
        v-text-field(
          v-model="form.serving.value"
          :label="$t('health.components.foodModal.form.serving.value')"
          :readonly="readonly"
          name="servingValue"
          data-qa="views.diet.food.form.serving.value"
        )
        .food-modal__serving__unit(data-qa="views.diet.food.form.serving.unit")
          v-select(
            v-model="form.serving.unit"
            :items="units"
            :label="$t('health.components.foodModal.form.serving.unit')"
            :readonly="readonly"
            name="servingUnit"
          )
      v-text-field(
        v-model="form.nutrients.calories"
        :label="$t('health.components.foodModal.form.calories')"
        :readonly="readonly"
        name="calories"
        type="number"
        data-qa="views.diet.food.form.calories"
      )
      v-text-field(
        v-model="form.nutrients.carbs"
        :label="$t('health.components.foodModal.form.carbs')"
        :readonly="readonly"
        name="carbs"
        type="number"
        data-qa="views.diet.food.form.carbs"
      )
      v-text-field(
        v-model="form.nutrients.protein"
        :label="$t('health.components.foodModal.form.protein')"
        :readonly="readonly"
        name="protein"
        type="number"
        data-qa="views.diet.food.form.protein"
      )
      v-text-field(
        v-model="form.nutrients.fat"
        :label="$t('health.components.foodModal.form.fat')"
        :readonly="readonly"
        name="fat"
        type="number"
        data-qa="views.diet.food.form.fat"
      )
      v-btn.d-none(
        v-if="!readonly"
        type="submit"
      )

</template>

<script>
import Modal from '../../core/components/Modal.vue';
import Food from '../models/food';

export default {
  components: {
    Modal,
  },
  props: {
    value: Boolean,
    item: Object,
    loading: Boolean,
    serverErrorType: String,
    headerColor: String,
    readonly: Boolean,
  },
  data () {
    return {
      form: null,
      units: Food.unitValues.map(value => ({ text: this.$t(`health.common.units.${value}`), value })),
      rules: {
        name: [ v => !!v || this.$t('health.components.foodModal.errors.name.required') ],
      },
    };
  },
  computed: {
    title () {
      const prefix = 'health.components.foodModal.';
      if (this.readonly) return this.$t(prefix + 'title.view');
      if (this.form && this.form.id) return this.$t(prefix + 'title.edit');
      return this.$t(prefix + 'title.new');
    },
  },
  methods: {
    cancel () {
      this.$emit('cancel');
    },
    confirm () {
      if (!this.readonly && this.$refs.form.validate()) this.$emit('confirm', this.form);
    },
    remove () {
      if (!this.readonly) this.$emit('remove', this.form);
    },
    getTitle () {

    },
  },
  watch: {
    item (newValue) { this.form = newValue ? Object.assign({}, newValue) : null; },
  },
};
</script>

<style lang="sass">
.food-modal
  &__serving
    display: flex

    &__unit
      max-width: 7rem
      margin-left: 1rem

</style>
