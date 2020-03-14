<template lang="pug">
  v-form.register-form(
    ref="form"
    @submit.prevent="submit()"
  )
    .red--text.mb-4(v-if="serverErrorType")
      | {{ $t(`components.registerForm.errors.server.${serverErrorType}`) }}
    v-text-field(
      v-model="form.email"
      :label="$t('components.registerForm.labels.email')"
      :rules="rules.email"
      name="email"
      type="email"
    )
    v-text-field(
      v-model="form.password"
      :label="$t('components.registerForm.labels.password')"
      :rules="rules.password"
      name="password"
      type="password"
    )
    v-text-field(
      v-model="form.passwordConfirm"
      :label="$t('components.registerForm.labels.passwordConfirm')"
      :rules="rules.passwordConfirm"
      name="passwordConfirm"
      type="password"
    )
    .d-flex.my-4.justify-end
      v-btn.primary(
        :loading="loading"
        type="submit"
        large
        tile
      ) {{ $t('components.registerForm.labels.submit') }}
    .d-flex
      router-link.register-form__sign-in-link(:to={ name: 'signIn' })
        | {{ $t('components.registerForm.signInLink') }}
</template>

<script>
export default {
  props: {
    loading: Boolean,
    serverErrorType: String,
    model: Object,
  },

  data () {
    return {
      form: {
        email: '',
        password: '',
        passwordConfirm: '',
      },
      rules: {
        email: [
          v => !!v || this.$t('components.registerForm.errors.email.required'),
          v => !!this.$config.EMAIL_REGEX.test(v) || this.$t('components.registerForm.errors.email.email'),
        ],
        password: [
          v => !!v || this.$t('components.registerForm.errors.password.required'),
        ],
        passwordConfirm: [
          v => !!v || this.$t('components.registerForm.errors.passwordConfirm.required'),
          v => v === this.form.password || this.$t('components.registerForm.errors.passwordConfirm.match'),
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
