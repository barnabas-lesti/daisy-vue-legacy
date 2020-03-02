<template lang="pug">
  v-app.app
    template(v-if="user")
      sidebar(
        v-model="sidebar.isOpen"
        :items="sortedSidebarItems"
        :active-route="$route.name"
        :loading="loading"
      )
      navbar(
        :user="user"
        :loading="loading"
        :title="navbarTitle"
        @toggle-sidebar="sidebar.isOpen = !sidebar.isOpen"
      )

    v-content
      v-container(fluid)
        router-view
        notifications(:items="notifications")

    v-footer(app)
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Navbar from './components/navbar/Navbar.vue';
import Notifications from './components/notifications/Notifications.vue';
import Sidebar from './components/sidebar/Sidebar.vue';

export default {
  components: {
    Navbar,
    Notifications,
    Sidebar,
  },
  data: () => ({
    sidebar: {
      isOpen: false,
    },
  }),

  computed: {
    ...mapState('core', [ 'user', 'notifications' ]),
    ...mapGetters('core', {
      loading: 'loading',
      sortedSidebarItems: 'sidebarItems/sorted',
      navbarTitle: 'title',
    }),
  },
};
</script>

<style lang="sass">
// Application wide theme overrides
.v-small-dialog__menu-content
  min-width: auto !important
</style>
