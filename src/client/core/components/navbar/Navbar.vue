<template lang="pug">
  v-app-bar.navbar(
    app
    dense
    clipped-left
  )
    v-app-bar-nav-icon.navbar__toggle(@click="$emit('toggle-sidebar')")
    v-toolbar-title {{ $t('core.appTitle') }}

    v-spacer
    v-btn(
      v-if="loading"
      color="primary"
      loading
      small
      icon
    )
    profile-menu(:user="user")

</template>

<script>
import ProfileMenu from './ProfileMenu.vue';

export default {
  components: {
    ProfileMenu,
  },
  props: {
    user: Object,
    loading: Boolean,
  },
};
</script>
