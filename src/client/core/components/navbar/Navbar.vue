<template lang="pug">
  v-app-bar.navbar(
    app
    dense
    clipped-left
  )
    v-app-bar-nav-icon.navbar__toggle(@click="$emit('toggle-sidebar')")
    v-toolbar-title {{ $t('core.appTitle') }}
    v-spacer

    navbar-profile-menu(:user="user")

</template>

<script>
import NavbarProfileMenu from './NavbarProfileMenu.vue';

export default {
  components: {
    NavbarProfileMenu,
  },
  props: {
    user: Object,
  },
};
</script>
