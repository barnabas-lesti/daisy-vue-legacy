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
      @submit.prevent="confirm()"
    )
      .red--text.mb-4(v-if="serverErrorType")
        | {{ $t(`health.components.editFoodModal.errors.server.${serverErrorType}`) }}
      v-text-field(
        v-model="form.name"
        :label="$t('health.components.editFoodModal.form.name')"
        :rules="rules.name"
        name="name"
      )
      v-text-field(
        v-model="form.description"
        :label="$t('health.components.editFoodModal.form.description')"
        name="description"
      )
      v-text-field(
        v-model="form.nutrition.calories"
        :label="$t('health.components.editFoodModal.form.calories')"
        name="calories"
        type="number"
      )
      v-text-field(
        v-model="form.nutrition.carbs"
        :label="$t('health.components.editFoodModal.form.carbs')"
        name="carbs"
        type="number"
      )
      v-text-field(
        v-model="form.nutrition.protein"
        :label="$t('health.components.editFoodModal.form.protein')"
        name="protein"
        type="number"
      )
      v-text-field(
        v-model="form.nutrition.fat"
        :label="$t('health.components.editFoodModal.form.fat')"
        name="fat"
        type="number"
      )
      v-btn.d-none(type="submit")

</template>

<script>
import Modal from '../../../core/components/Modal.vue';

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
