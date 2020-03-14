<template lang="pug">
  .register
    template(v-if="$vuetify.breakpoint.xs")
      v-row
        v-col
          h1.register__title.text-center.mb-2 {{ $t('views.register.title') }}
      v-row
        v-col
          register-form(
            :loading="loading"
            :server-error-type="serverErrorType"
            @submit="register($event)"
          )

    template(v-else)
      v-row(justify="center")
        v-col(md="6")
          v-card.mt-6.pa-4
            v-card-title
              h1.text-center.mb-2 {{ $t('views.register.title') }}
            v-card-text
              register-form(
                :loading="loading"
                :server-error-type="serverErrorType"
                @submit="register($event)"
              )

</template>

<script>
import { mapGetters } from 'vuex';

import RegisterForm from '../components/RegisterForm';

export default {
  components: {
    RegisterForm,
  },

  data () {
    return {
      serverErrorType: '',
    };
  },
  computed: {
    ...mapGetters({
      loading: 'common/loading',
    }),
  },
  methods: {
    async register (form) {
      this.serverErrorType = '';
      try {
        await this.$store.dispatch('auth/register', form);
        this.$store.dispatch('common/notify/success', this.$t('views.register.notifications.success'));
        this.$router.push({ name: 'signIn', params: { email: form.email } });
      } catch ({ error }) {
        switch (error) {
          case 'ALREADY_EXISTS': this.serverErrorType = 'alreadyExists'; break;
          case 'REGISTRATION_DISABLED': this.serverErrorType = 'registrationDisabled'; break;
          default: this.serverErrorType = 'unknown';
        }
      }
    },
  },
};
</script>
