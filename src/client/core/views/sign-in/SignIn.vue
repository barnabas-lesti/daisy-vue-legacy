<template lang="pug">
  .sign-in.view
    template(v-if="$vuetify.breakpoint.xs")
      v-row
        v-col
          h1.text-center.mb-2 {{ $t('core.views.signIn.title') }}
      v-row
        v-col
          .d-flex.justify-center(v-if="authHeader && !serverError")
            v-progress-circular(
              color="primary"
              indeterminate
            )
          sign-in-form(
            v-else
            :email="email"
            :loading="isLoading"
            :server-error="serverError"
            @submit="signInWithCredentials($event)"
          )

    template(v-else)
      v-row(justify="center")
        v-col(md="6")
          v-card.mt-6.pa-4
            v-card-title
              h1.text-center.mb-2 {{ $t('core.views.signIn.title') }}
            v-card-text
              v-progress-circular(
                v-if="authHeader && !serverError"
                color="primary"
                indeterminate
              )
              sign-in-form(
                v-else
                :email="email"
                :loading="isLoading"
                :server-error="serverError"
                @submit="signInWithCredentials($event)"
              )
</template>

<script>
import { mapState } from 'vuex';

import SignInForm from './SignInForm';

const serverErrorLocaleMap = {
  'NOT_FOUND': 'invalidCredentials',
  'INVALID_CREDENTIALS': 'invalidCredentials',
  'UNAUTHORIZED': 'sessionExpired',
};

export default {
  components: {
    SignInForm,
  },

  data () {
    return {
      email: '',
      isLoading: false,
      serverError: '',
    };
  },

  computed: {
    ...mapState('core', [ 'authHeader' ]),
  },

  methods: {
    async signInWithCredentials (form) {
      this.serverError = '';
      this.isLoading = true;
      try {
        await this.$store.dispatch('core/signInWithCredentials', form);
        this._navigateToReferer();
      } catch ({ error }) {
        let typeKey;
        switch (error) {
          case 'NOT_FOUND': typeKey = 'invalidCredentials'; break;
          case 'INVALID_CREDENTIALS': typeKey = 'invalidCredentials'; break;
          default: typeKey = 'unknown';
        }
        this.serverError = this.$t(`core.views.signIn.signInForm.errors.server.${typeKey}`);
      }
      this.isLoading = false;
    },

    async signInWithHeader (authHeader) {
      this.serverError = '';
      this.isLoading = true;
      try {
        await this.$store.dispatch('core/signInWithAuthHeader', authHeader);
        this._navigateToReferer();
      } catch ({ error }) {
        let typeKey;
        switch (error) {
          case 'NOT_FOUND': typeKey = 'notFound'; break;
          case 'UNAUTHORIZED': typeKey = 'sessionExpired'; break;
          default: typeKey = 'unknown';
        }
        this.serverError = this.$t(`core.views.signIn.signInForm.errors.server.${typeKey}`);
        this.$store.dispatch('core/signOut');
      }
      this.isLoading = false;
    },

    _navigateToReferer () {
      const { referer } = this.$route.query;
      this.$router.push(referer || { name: 'home' });
    },
  },

  created () {
    const authHeader = this.authHeader || this.$storage.getFromLocalStorage('core.authHeader');
    if (authHeader) this.signInWithHeader(authHeader);

    const { email } = this.$route.params;
    this.email = email || this.email;
  },
};
</script>
