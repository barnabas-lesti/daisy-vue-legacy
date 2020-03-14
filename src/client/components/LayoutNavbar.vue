<template lang="pug">
  v-app-bar.layout-navbar(
    app
    dense
    clipped-left
  )
    v-app-bar-nav-icon.layout-navbar__toggle(@click="$emit('toggle-sidebar')")
    v-toolbar-title.layout-navbar__title.title {{ title }}

    v-spacer
    v-btn(
      v-show="loading"
      color="primary"
      loading
      icon
    )
    layout-navbar-profile-menu(:user="user")
</template>

<script>
import LayoutNavbarProfileMenu from './LayoutNavbarProfileMenu';

export default {
  components: {
    LayoutNavbarProfileMenu,
  },
  props: {
    user: Object,
    loading: Boolean,
    title: String,
  },
};
</script>
