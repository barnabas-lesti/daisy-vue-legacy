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
        icon
      )
        v-avatar(size="2rem")
          v-icon(v-if="!user.profileImageUrl") {{ $theme.icons.mdiAccount }}
          img(
            v-else
            :src="user.profileImageUrl"
            :alt="user.fullName"
          )
    v-list(tile)
      v-list-item(
        :to="{ name: 'profile' }"
        link
      )
        v-list-item-avatar
          v-icon(
            v-if="!user.profileImageUrl"
          ) {{ $theme.icons.mdiAccount }}
          img(
            v-else
            :src="user.profileImageUrl"
            :alt="user.fullName"
          )
        v-list-item-content
          v-list-item-title.title(v-if="user.fullName") {{ user.fullName }}
          v-list-item-subtitle {{ user.email }}

      v-divider
      v-list-item(:to="{ name: 'signOut' }")
        v-list-item-title {{ $t('core.components.navbar.signOut') }}
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>
