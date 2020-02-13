<template lang="pug">
  .profile.view
    v-row
      v-col
        h1 {{ $t('core.views.profile.title') }}

    v-row
      v-col(md="6")
        h2 {{ $t('core.views.profile.general.title') }}
        .red--text.mb-4(v-if="general.serverError") {{ general.serverError }}
        v-form(
          ref="generalForm"
          @submit.prevent="updateProfile()"
        )
          v-text-field(
            v-model="user.email"
            :label="$t('core.views.profile.general.labels.email')"
            name="email"
            type="email"
            disabled
          )
          v-text-field(
            v-model="general.form.fullName"
            :label="$t('core.views.profile.general.labels.fullName')"
            name="fullName"
          )
          v-text-field(
            v-model="general.form.profileImageUrl"
            :label="$t('core.views.profile.general.labels.profileImageUrl')"
            name="profileImageUrl"
          )
          .d-flex.my-4.justify-end
            v-btn(
              :loading="general.isLoading"
              color="primary"
              type="submit"
              large
            ) {{ $t('core.views.profile.general.labels.submit') }}
        v-divider

    v-row
      v-col(md="6")
        h2 {{ $t('core.views.profile.password.title') }}
        .red--text.mb-4(v-if="password.serverError") {{ password.serverError }}
        v-form(
          ref="passwordForm"
          @submit.prevent="updatePassword()"
        )
          v-text-field(
            v-model="password.form.password"
            :label="$t('core.views.profile.password.labels.password')"
            :rules="password.rules.password"
            name="password"
            type="password"
          )
          v-text-field(
            v-model="password.form.newPassword"
            :label="$t('core.views.profile.password.labels.newPassword')"
            :rules="password.rules.newPassword"
            name="newPassword"
            type="password"
          )
          v-text-field(
            v-model="password.form.newPasswordConfirm"
            :label="$t('core.views.profile.password.labels.newPasswordConfirm')"
            :rules="password.rules.newPasswordConfirm"
            name="newPasswordConfirm"
            type="password"
          )
          .d-flex.my-4.justify-end
            v-btn(
              :loading="password.isLoading"
              color="primary"
              type="submit"
              large
            ) {{ $t('core.views.profile.password.labels.submit') }}
</template>

<script>
export default {
  data () {
    const user = this.$store.state.core.user;
    return {
      user,
      general: {
        isLoading: false,
        serverError: '',
        form: user,
      },
      password: {
        isLoading: false,
        serverError: '',
        form: {
          password: '',
          newPassword: '',
          newPasswordConfirm: '',
        },
        rules: {
          password: [
            v => !!v || this.$t('core.views.profile.password.errors.password.required'),
          ],
          newPassword: [
            v => !!v || this.$t('core.views.profile.password.errors.newPassword.required'),
          ],
          newPasswordConfirm: [
            v => !!v || this.$t('core.views.profile.password.errors.newPasswordConfirm.required'),
            v => v === this.password.form.newPassword || this.$t('core.views.profile.password.errors.newPasswordConfirm.match'),
          ],
        },
      },
    };
  },

  methods: {
    async updateProfile () {
      this.general.serverError = '';
      if (!this.general.isLoading && this.$refs.generalForm.validate()) {
        this.general.isLoading = true;
        try {
          await this.$store.dispatch('core/updateProfile', this.general.form);
        } catch ({ error }) {
          const typeKey = 'unknown';
          this.serverError = this.$t(`core.views.profile.general.errors.server.${typeKey}`);
        }
        this.general.isLoading = false;
      }
    },
    async updatePassword () {
      this.password.serverError = '';
      if (!this.password.isLoading && this.$refs.passwordForm.validate()) {
        this.password.isLoading = true;
        try {
          await this.$store.dispatch('core/updatePassword', this.password.form);
        } catch ({ error }) {
          let typeKey;
          switch (error) {
            case 'INVALID_CREDENTIALS': typeKey = 'invalidCredentials'; break;
            default: typeKey = 'unknown';
          }
          this.password.serverError = this.$t(`core.views.profile.password.errors.server.${typeKey}`);
        }
        this.password.isLoading = false;
      }
    },
  },
};
</script>
