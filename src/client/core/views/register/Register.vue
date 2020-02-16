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
            :server-error-type="serverErrorType"
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
                :server-error-type="serverErrorType"
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
      serverErrorType: '',
    };
  },

  methods: {
    async register (form) {
      this.serverErrorType = '';
      this.isLoading = true;
      try {
        await this.$store.dispatch('core/register', form);
        this.$store.dispatch('core/notify/success', this.$t('core.views.register.notifications.success'));
        this.$router.push({ name: 'signIn', params: { email: form.email } });
      } catch ({ error }) {
        switch (error) {
          case 'ALREADY_EXISTS': this.serverErrorType = 'alreadyExists'; break;
          case 'REGISTRATION_DISABLED': this.serverErrorType = 'registrationDisabled'; break;
          default: this.serverErrorType = 'unknown';
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
