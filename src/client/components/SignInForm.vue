<template lang="pug">
  v-form.sign-in-form(
    ref="form"
    @submit.prevent="submit()"
  )
    .red--text.mb-4(v-if="serverErrorType") {{ $t(`components.signInForm.errors.server.${serverErrorType}`) }}
    v-text-field(
      v-model="form.email"
      :label="$t('components.signInForm.labels.email')"
      :rules="rules.email"
      name="email"
      type="email"
    )
    v-text-field(
      v-model="form.password"
      :label="$t('components.signInForm.labels.password')"
      :rules="rules.password"
      name="password"
      type="password"
    )
    .d-flex.mb-4.justify-end
      v-btn.primary(
        :loading="loading"
        type="submit"
        large
        tile
      ) {{ $t('components.signInForm.labels.submit') }}
    .d-flex
      router-link.sign-in-form__register-link(:to={ name: 'register' })
        | {{ $t('components.signInForm.registerLink') }}
</template>

<script>
export default {
  props: {
    email: String,
    loading: Boolean,
    serverErrorType: String,
  },

  data () {
    return {
      form: {
        email: this.email || '',
        password: '',
      },
      rules: {
        email: [
          v => !!v || this.$t('components.signInForm.errors.email.required'),
          v => !!this.$config.EMAIL_REGEX.test(v) || this.$t('components.signInForm.errors.email.email'),
        ],
        password: [
          v => !!v || this.$t('components.signInForm.errors.password.required'),
        ],
      },
    };
  },

  methods: {
    submit () {
      if (!this.loading && this.$refs.form.validate()) {
        this.$emit('submit', this.form);
      }
    },
  },
};
</script>
