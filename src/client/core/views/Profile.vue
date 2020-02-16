<template lang="pug">
  .profile.view
    v-row
      v-col
        h1 {{ $t('core.views.profile.title') }}

    v-row.profile__general
      v-col(md="6")
        h2 {{ $t('core.views.profile.general.title') }}
        v-form(
          ref="generalForm"
          data-qa="generalForm"
          @submit.prevent="updateProfile()"
        )
          .red--text.mb-4(v-if="general.serverError") {{ general.serverError }}
          v-text-field(
            v-model="user.email"
            :label="$t('core.views.profile.general.labels.email')"
            name="email"
            type="email"
            data-qa="generalForm.email"
            disabled
          )
          v-text-field(
            v-model="general.form.fullName"
            :label="$t('core.views.profile.general.labels.fullName')"
            name="fullName"
            data-qa="generalForm.fullName"
          )
          v-text-field(
            v-model="general.form.profileImageUrl"
            :label="$t('core.views.profile.general.labels.profileImageUrl')"
            name="profileImageUrl"
            data-qa="generalForm.profileImageUrl"
          )
          .d-flex.my-4.justify-end
            v-btn(
              :loading="general.isLoading"
              color="primary"
              type="submit"
              data-qa="generalForm.submit"
              large
              tile
            ) {{ $t('core.views.profile.general.labels.submit') }}
        v-divider

    v-row.profile__password
      v-col(md="6")
        h2 {{ $t('core.views.profile.password.title') }}
        v-form(
          ref="passwordForm"
          data-qa="passwordForm"
          @submit.prevent="updatePassword()"
        )
          .red--text.mb-4(v-if="password.serverError") {{ password.serverError }}
          v-text-field(
            v-model="password.form.password"
            :label="$t('core.views.profile.password.labels.password')"
            :rules="password.rules.password"
            name="password"
            type="password"
            data-qa="passwordForm.password"
          )
          v-text-field(
            v-model="password.form.newPassword"
            :label="$t('core.views.profile.password.labels.newPassword')"
            :rules="password.rules.newPassword"
            name="newPassword"
            type="password"
            data-qa="passwordForm.newPassword"
          )
          v-text-field(
            v-model="password.form.newPasswordConfirm"
            :label="$t('core.views.profile.password.labels.newPasswordConfirm')"
            :rules="password.rules.newPasswordConfirm"
            name="newPasswordConfirm"
            type="password"
            data-qa="passwordForm.newPasswordConfirm"
          )
          .d-flex.my-4.justify-end
            v-btn(
              :loading="password.isLoading"
              color="primary"
              type="submit"
              data-qa="passwordForm.submit"
              large
              tile
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
          this.$store.dispatch('core/notify/success', this.$t('core.views.profile.general.notifications.updated'));
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
          this.$store.dispatch('core/notify/success', this.$t('core.views.profile.password.notifications.updated'));
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
