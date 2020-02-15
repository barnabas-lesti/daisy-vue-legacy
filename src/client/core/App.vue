<template lang="pug">
  v-app.app
    template(v-if="user")
      sidebar(
        v-model="sidebar.isOpen"
        :items="groupedSidebarItems"
      )
      navbar(
        :user="user"
        @toggle-sidebar="sidebar.isOpen = !sidebar.isOpen"
      )

    v-content
      v-container(fluid)
        v-breadcrumbs.ma-0.pa-0(
          v-if="user && breadcrumbs && breadcrumbs.length > 0"
          :items="breadcrumbs"
        )
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
    ...mapState('core', [ 'user', 'breadcrumbs', 'notifications' ]),
    ...mapGetters('core', [ 'groupedSidebarItems' ]),
  },
};
</script>
