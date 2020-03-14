<template lang="pug">
  v-menu.layout-navbar-profile-menu(
    left
    bottom
    offset-y
    tile
  )
    template(v-slot:activator="{ on }")
      v-btn.layout-navbar-profile-menu__activator(
        v-on="on"
        icon
      )
        v-avatar(size="2rem")
          v-icon.layout-navbar-profile-menu__activator__icon(v-show="!user.profileImageUrl") {{ $theme.icons.mdiAccount }}
          img.layout-navbar-profile-menu__activator__image(
            v-show="user.profileImageUrl"
            :src="user.profileImageUrl"
            :alt="user.fullName"
          )
    v-list(tile)
      v-list-item.layout-navbar-profile-menu__item.layout-navbar-profile-menu__item--profile(
        :to="{ name: 'profile' }"
        link
      )
        v-list-item-avatar
          v-icon.layout-navbar-profile-menu__item__icon(
            v-show="!user.profileImageUrl"
          ) {{ $theme.icons.mdiAccount }}
          img.layout-navbar-profile-menu__item__image(
            v-show="user.profileImageUrl"
            :src="user.profileImageUrl"
            :alt="user.fullName"
          )
        v-list-item-content
          v-list-item-title.title.layout-navbar-profile-menu__item__title(v-if="user.fullName") {{ user.fullName }}
          v-list-item-subtitle.layout-navbar-profile-menu__item__subtitle {{ user.email }}

      v-divider
      v-list-item.layout-navbar-profile-menu__item--sign-out(:to="{ name: 'signOut' }")
        v-list-item-title {{ $t('components.layoutNavbarProfileMenu.signOut') }}
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>
