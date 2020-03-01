<template lang="pug">
  v-app-bar.navbar(
    app
    dense
    clipped-left
  )
    v-btn(
      v-if="loading"
      color="primary"
      loading
      icon
    )
    v-app-bar-nav-icon.navbar__toggle(
      v-else
      @click="$emit('toggle-sidebar')"
    )
    v-toolbar-title.title {{ $t('core.appTitle') }}

    v-spacer
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
