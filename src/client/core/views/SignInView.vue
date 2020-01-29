<template lang="pug">
  .sign-in.view.d-flex.justify-center
    v-card.mt-10.pa-4(
      outlined
      raised
    )
      h1.text-center.mb-2 {{ $t('core.views.signIn.title') }}
      v-list.mb-2(tile)
        v-list-item
          v-list-item-avatar
            img(
              :src="tempUser.profileImageUrl"
              :alt="tempUser.fullName"
            )
          v-list-item-content
            v-list-item-title.title {{ tempUser.fullName }}
            v-list-item-subtitle {{ tempUser.email }}
      v-card-actions.justify-center.mb-2
        v-btn.px-4(
          color="primary"
          large
          outlined
          @click="signIn()"
        ) {{ $t('core.views.signIn.signInAs', { name: tempUser.fullName }) }}
      p.mb-0.mt-4.pa-0.blockquote.caption.font-italic {{ $t('core.views.signIn.signInAsHint') }}
</template>

<script>
export default {
  data: () => ({
    tempUser: {
      email: 'barnabas.lesti@gmail.com',
      fullName: 'Barnabas Lesti',
      profileImageUrl: 'https://avatars1.githubusercontent.com/u/11849644',
    },
  }),

  methods: {
    signIn () {
      this.$store.dispatch('core/signInUser', this.tempUser);
    },
  },
};
</script>
