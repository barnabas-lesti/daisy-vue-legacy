<template lang="pug">
  .sign-in
    template(v-if="$vuetify.breakpoint.xs")
      v-row
        v-col
          h1.sign-in__title.text-center.mb-2 {{ $t('views.signIn.title') }}
      v-row
        v-col
          .d-flex.justify-center(v-if="authHeader && !serverErrorType")
            v-progress-circular(
              color="primary"
              indeterminate
            )
          sign-in-form(
            v-else
            :email="email"
            :loading="loading"
            :server-error-type="serverErrorType"
            @submit="signInWithCredentials($event)"
          )

    template(v-else)
      v-row(justify="center")
        v-col(md="6")
          v-card.mt-6.pa-4
            v-card-title
              h1.text-center.mb-2 {{ $t('views.signIn.title') }}
            v-card-text
              v-progress-circular(
                v-if="authHeader && !serverErrorType"
                color="primary"
                indeterminate
              )
              sign-in-form(
                v-else
                :email="email"
                :loading="loading"
                :server-error-type="serverErrorType"
                @submit="signInWithCredentials($event)"
              )
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import SignInForm from '../components/SignInForm';

export default {
  components: {
    SignInForm,
  },

  data () {
    return {
      email: '',
      serverErrorType: '',
    };
  },

  computed: {
    ...mapState({
      authHeader: 'auth/authHeader',
    }),
    ...mapGetters({
      loading: 'common/loading',
    }),
  },

  methods: {
    async signInWithCredentials (form) {
      this.serverErrorType = '';
      try {
        await this.$store.dispatch('auth/signIn/withCredentials', form);
        this.$store.dispatch('common/notify/success', this.$t('views.signIn.notifications.success', { email: form.email }));
        this._navigateToReferer();
      } catch ({ error }) {
        switch (error) {
          case 'NOT_FOUND': this.serverErrorType = 'invalidCredentials'; break;
          case 'INVALID_CREDENTIALS': this.serverErrorType = 'invalidCredentials'; break;
          default: this.serverErrorType = 'unknown';
        }
      }
    },

    async signInWithHeader (authHeader) {
      this.serverErrorType = '';
      try {
        await this.$store.dispatch('auth/signIn/withAuthHeader', authHeader);
        this._navigateToReferer();
      } catch ({ error }) {
        switch (error) {
          case 'NOT_FOUND': this.serverErrorType = 'notFound'; break;
          case 'UNAUTHORIZED': this.serverErrorType = 'sessionExpired'; break;
          default: this.serverErrorType = 'unknown';
        }
        this.$store.dispatch('auth/signOut');
      }
    },

    _navigateToReferer () {
      const { referer } = this.$route.query;
      this.$router.push(referer || { name: 'home' });
    },
  },

  created () {
    const authHeader = this.authHeader || this.$storage.getFromLocalStorage('auth/authHeader');
    if (authHeader) this.signInWithHeader(authHeader);

    const { email } = this.$route.params;
    this.email = email || this.email;
  },
};
</script>
