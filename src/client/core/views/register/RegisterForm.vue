<template lang="pug">
  v-form.register-form(
    ref="form"
    @submit.prevent="submit()"
  )
    .red--text.mb-4(v-if="serverErrorType")
      | {{ $t(`core.views.register.registerForm.errors.server.${serverErrorType}`) }}
    v-text-field(
      v-model="form.email"
      :label="$t('core.views.register.registerForm.labels.email')"
      :rules="rules.email"
      name="email"
      type="email"
    )
    v-text-field(
      v-model="form.password"
      :label="$t('core.views.register.registerForm.labels.password')"
      :rules="rules.password"
      name="password"
      type="password"
    )
    v-text-field(
      v-model="form.passwordConfirm"
      :label="$t('core.views.register.registerForm.labels.passwordConfirm')"
      :rules="rules.passwordConfirm"
      name="passwordConfirm"
      type="password"
    )
    .d-flex.my-4.justify-end
      v-btn(
        :loading="loading"
        color="primary"
        type="submit"
        large
        tile
      ) {{ $t('core.views.register.registerForm.labels.submit') }}
    .d-flex
      router-link.register-form__sign-in-link(:to={ name: 'signIn' })
        | {{ $t('core.views.register.registerForm.signInLink') }}
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
          v => !!v || this.$t('core.views.register.registerForm.errors.email.required'),
          v => !!this.$config.EMAIL_REGEX.test(v) || this.$t('core.views.register.registerForm.errors.email.email'),
        ],
        password: [
          v => !!v || this.$t('core.views.register.registerForm.errors.password.required'),
        ],
        passwordConfirm: [
          v => !!v || this.$t('core.views.register.registerForm.errors.passwordConfirm.required'),
          v => v === this.form.password || this.$t('core.views.register.registerForm.errors.passwordConfirm.match'),
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
