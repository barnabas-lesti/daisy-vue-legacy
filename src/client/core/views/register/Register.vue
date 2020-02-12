<template lang="pug">
  .register.view
    template(v-if="$vuetify.breakpoint.xs")
      v-row
        v-col
          h1.text-center.mb-2 {{ $t('core.views.register.title') }}
      v-row
        v-col
          register-form(
            :loading="isLoading"
            :server-error="serverError"
            @submit="register($event)"
          )

    template(v-else)
      v-row(justify="center")
        v-col(md="6")
          v-card.mt-6.pa-4
            v-card-title
              h1.text-center.mb-2 {{ $t('core.views.register.title') }}
            v-card-text
              register-form(
                :loading="isLoading"
                :server-error="serverError"
                @submit="register($event)"
              )

</template>

<script>
import RegisterForm from './RegisterForm';

export default {
  components: {
    RegisterForm,
  },

  data () {
    return {
      isLoading: false,
      serverError: '',
    };
  },

  methods: {
    async register (form) {
      this.serverError = '';
      this.isLoading = true;
      try {
        await this.$store.dispatch('core/register', form);
        this.$router.push({ name: 'signIn', params: { email: form.email } });
      } catch ({ error }) {
        const typeKey = error === 'ALREADY_EXISTS' ? 'alreadyExists' : 'unknown';
        this.serverError = this.$t(`core.views.register.registerForm.errors.server.${typeKey}`);
      }
      this.isLoading = false;
    },
  },
};
</script>
