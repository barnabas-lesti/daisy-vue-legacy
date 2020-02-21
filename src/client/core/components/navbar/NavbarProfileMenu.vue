<template lang="pug">
  v-menu.navbar-profile-menu(
    left
    bottom
    offset-y
    tile
  )
    template(v-slot:activator="{ on }")
      v-btn(
        v-on="on"
        data-qa="navbar.profile.activator"
        icon
      )
        v-avatar(size="2rem")
          v-icon(
            v-if="!user.profileImageUrl"
            data-qa="navbar.profile.activator.icon"
          ) {{ $theme.icons.mdiAccount }}
          img(
            v-else
            :src="user.profileImageUrl"
            :alt="user.fullName"
            data-qa="navbar.profile.activator.image"
          )
    v-list(tile)
      v-list-item(
        :to="{ name: 'profile' }"
        data-qa="navbar.profile.items.profile.link"
        link
      )
        v-list-item-avatar
          v-icon(
            v-if="!user.profileImageUrl"
            data-qa="navbar.profile.items.profile.icon"
          ) {{ $theme.icons.mdiAccount }}
          img(
            v-else
            :src="user.profileImageUrl"
            :alt="user.fullName"
            data-qa="navbar.profile.items.profile.image"
          )
        v-list-item-content
          v-list-item-title.title(
            v-if="user.fullName"
            data-qa="navbar.profile.items.profile.fullName"
          ) {{ user.fullName }}
          v-list-item-subtitle(data-qa="navbar.profile.items.profile.email") {{ user.email }}

      v-divider
      v-list-item(
        :to="{ name: 'signOut' }"
        data-qa="navbar.profile.items.signOut.link"
      )
        v-list-item-title {{ $t('core.components.navbar.signOut') }}
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>
