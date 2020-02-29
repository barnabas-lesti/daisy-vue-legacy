<template lang="pug">
  v-menu.profile-menu(
    left
    bottom
    offset-y
    tile
  )
    template(v-slot:activator="{ on }")
      v-btn.profile-menu__activator(
        v-on="on"
        icon
      )
        v-avatar(size="2rem")
          v-icon.profile-menu__activator__icon(v-show="!user.profileImageUrl") {{ $theme.icons.mdiAccount }}
          img.profile-menu__activator__image(
            v-show="user.profileImageUrl"
            :src="user.profileImageUrl"
            :alt="user.fullName"
          )
    v-list(tile)
      v-list-item.profile-menu__item.profile-menu__item--profile(
        :to="{ name: 'profile' }"
        link
      )
        v-list-item-avatar
          v-icon.profile-menu__item__icon(
            v-show="!user.profileImageUrl"
          ) {{ $theme.icons.mdiAccount }}
          img.profile-menu__item__image(
            v-show="user.profileImageUrl"
            :src="user.profileImageUrl"
            :alt="user.fullName"
          )
        v-list-item-content
          v-list-item-title.title.profile-menu__item__title(v-if="user.fullName") {{ user.fullName }}
          v-list-item-subtitle.profile-menu__item__subtitle {{ user.email }}

      v-divider
      v-list-item.profile-menu__item--sign-out(:to="{ name: 'signOut' }")
        v-list-item-title {{ $t('core.components.navbar.signOut') }}
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>
