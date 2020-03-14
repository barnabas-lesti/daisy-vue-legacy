<template lang="pug">
  .profile
    v-row.profile__general
      v-col(md="6")
        h2 {{ $t('views.profile.general.title') }}
        v-form(
          ref="generalForm"
          @submit.prevent="updateProfile()"
        )
          .red--text.mb-4(v-if="general.serverError") {{ general.serverError }}
          v-text-field(
            v-model="user.email"
            :label="$t('views.profile.general.labels.email')"
            name="email"
            type="email"
            disabled
          )
          v-text-field(
            v-model="general.form.fullName"
            :label="$t('views.profile.general.labels.fullName')"
            name="fullName"
          )
          v-text-field(
            v-model="general.form.profileImageUrl"
            :label="$t('views.profile.general.labels.profileImageUrl')"
            name="profileImageUrl"
          )
          .d-flex.my-4.justify-end
            v-btn.profile__general__submit.primary(
              :disabled="loading"
              type="submit"
              large
              tile
            ) {{ $t('views.profile.general.labels.submit') }}
        v-divider

    v-row.profile__password
      v-col(md="6")
        h2 {{ $t('views.profile.password.title') }}
        v-form(
          ref="passwordForm"
          @submit.prevent="updatePassword()"
        )
          .red--text.mb-4(v-if="password.serverError") {{ password.serverError }}
          v-text-field(
            v-model="password.form.password"
            :label="$t('views.profile.password.labels.password')"
            :rules="password.rules.password"
            name="password"
            type="password"
          )
          v-text-field(
            v-model="password.form.newPassword"
            :label="$t('views.profile.password.labels.newPassword')"
            :rules="password.rules.newPassword"
            name="newPassword"
            type="password"
          )
          v-text-field(
            v-model="password.form.newPasswordConfirm"
            :label="$t('views.profile.password.labels.newPasswordConfirm')"
            :rules="password.rules.newPasswordConfirm"
            name="newPasswordConfirm"
            type="password"
          )
          .d-flex.my-4.justify-end
            v-btn.profile__password__submit.primary(
              :disabled="loading"
              type="submit"
              large
              tile
            ) {{ $t('views.profile.password.labels.submit') }}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data () {
    const user = this.$store.state.auth.user;
    return {
      user,
      general: {
        serverError: '',
        form: user,
      },
      password: {
        serverError: '',
        form: {
          password: '',
          newPassword: '',
          newPasswordConfirm: '',
        },
        rules: {
          password: [
            v => !!v || this.$t('views.profile.password.errors.password.required'),
          ],
          newPassword: [
            v => !!v || this.$t('views.profile.password.errors.newPassword.required'),
          ],
          newPasswordConfirm: [
            v => !!v || this.$t('views.profile.password.errors.newPasswordConfirm.required'),
            v => v === this.password.form.newPassword || this.$t('views.profile.password.errors.newPasswordConfirm.match'),
          ],
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      loading: 'common/loading',
    }),
  },
  methods: {
    async updateProfile () {
      this.general.serverError = '';
      if (!this.loading && this.$refs.generalForm.validate()) {
        try {
          await this.$store.dispatch('auth/profile/update', this.general.form);
          this.$store.dispatch('common/notify/success', this.$t('views.profile.general.notifications.updated'));
        } catch ({ error }) {
          const typeKey = 'unknown';
          this.serverError = this.$t(`views.profile.general.errors.server.${typeKey}`);
        }
      }
    },
    async updatePassword () {
      this.password.serverError = '';
      if (!this.loading && this.$refs.passwordForm.validate()) {
        try {
          await this.$store.dispatch('auth/password/update', this.password.form);
          this.$store.dispatch('common/notify/success', this.$t('views.profile.password.notifications.updated'));
        } catch ({ error }) {
          let typeKey;
          switch (error) {
            case 'INVALID_CREDENTIALS': typeKey = 'invalidCredentials'; break;
            default: typeKey = 'unknown';
          }
          this.password.serverError = this.$t(`views.profile.password.errors.server.${typeKey}`);
        }
      }
    },
  },
};
</script>
