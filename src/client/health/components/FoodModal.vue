<template lang="pug">
  modal.food-modal(
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
    v-form(
      v-if="localItem"
      ref="form"
      data-qa="components.foodModal.form"
      @submit.prevent="confirm()"
    )
      .red--text.mb-4(v-if="serverErrorType")
        | {{ $t(`health.components.foodModal.errors.server.${serverErrorType}`) }}
      v-text-field(
        v-model="localItem.name"
        :label="$t('health.components.foodModal.form.name')"
        :rules="rules.name"
        :readonly="readonly"
        name="name"
        data-qa="components.foodModal.form.name"
      )
      v-text-field(
        v-model="localItem.description"
        :label="$t('health.components.foodModal.form.description')"
        :readonly="readonly"
        name="description"
        data-qa="components.foodModal.form.description"
      )
      .food-modal__serving
        v-text-field(
          v-model="localItem.serving.value"
          :label="$t('health.components.foodModal.form.serving.value')"
          :readonly="readonly"
          name="servingValue"
          data-qa="components.foodModal.form.serving.value"
        )
        .food-modal__serving__unit(data-qa="components.foodModal.form.serving.unit")
          v-select(
            v-model="localItem.serving.unit"
            :items="units"
            :label="$t('health.components.foodModal.form.serving.unit')"
            :readonly="readonly"
            name="servingUnit"
          )
      v-text-field(
        v-model="localItem.nutrients.calories"
        :label="$t('health.components.foodModal.form.calories')"
        :readonly="readonly"
        name="calories"
        type="number"
        data-qa="components.foodModal.form.calories"
      )
      v-text-field(
        v-model="localItem.nutrients.carbs"
        :label="$t('health.components.foodModal.form.carbs')"
        :readonly="readonly"
        name="carbs"
        type="number"
        data-qa="components.foodModal.form.carbs"
      )
      v-text-field(
        v-model="localItem.nutrients.protein"
        :label="$t('health.components.foodModal.form.protein')"
        :readonly="readonly"
        name="protein"
        type="number"
        data-qa="components.foodModal.form.protein"
      )
      v-text-field(
        v-model="localItem.nutrients.fat"
        :label="$t('health.components.foodModal.form.fat')"
        :readonly="readonly"
        name="fat"
        type="number"
        data-qa="components.foodModal.form.fat"
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
    loading: Boolean,
    headerColor: String,
    readonly: Boolean,
    serverErrorType: String,

    value: Boolean,
    item: Object,
  },
  data () {
    return {
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
      if (this.localItem && this.localItem.id) return this.$t(prefix + 'title.edit');
      return this.$t(prefix + 'title.new');
    },
    isOpen: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
    localItem () { return this.item; },
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
