<template lang="pug">
  .nav-bar-profile
    v-btn(
      v-if="!user"
      :to="{ name: 'signIn' }"
      text
    ) Sign in
    v-menu(
      v-else
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
            img(
              :src="user.profileImageUrl"
              :alt="user.fullName"
            )
      v-list(tile)
        v-list-item(link)
          v-list-item-avatar
            img(
              :src="user.profileImageUrl"
              :alt="user.fullName"
            )
          v-list-item-content
            v-list-item-title.title {{ user.fullName }}
            v-list-item-subtitle {{ user.email }}
      v-divider
      v-list(tile)
        v-list-item(
          :to="{ name: 'signOut' }"
        )
          v-list-item-title Sign out
</template>

<script>
export default {
  props: {
    user: Object,
  },
};
</script>
