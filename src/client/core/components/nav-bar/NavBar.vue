<template lang="pug">
  v-app-bar.nav-bar(
    app
    dense
    clipped-left
  )
    v-app-bar-nav-icon(@click="$emit('toggle-sidebar')")
    v-toolbar-title {{ $t('core.appTitle') }}
    v-spacer

    nav-bar-profile(:user="user")

</template>

<script>
import NavBarProfile from './NavBarProfile.vue';

export default {
  components: {
    NavBarProfile,
  },
  props: {
    user: Object,
  },
};
</script>
