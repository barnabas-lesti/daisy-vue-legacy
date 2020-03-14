<template lang="pug">
  v-app.app
    template(v-if="user")
      layout-sidebar(
        v-model="sidebar.isOpen"
        :items="sortedSidebarItems"
        :active-route="$route.name"
        :loading="loading"
      )
      layout-navbar(
        :user="user"
        :loading="loading"
        :title="navbarTitle"
        @toggle-sidebar="sidebar.isOpen = !sidebar.isOpen"
      )

    v-content
      v-container(fluid)
        router-view
        layout-notifications(:items="notifications")

    v-footer(app)
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import LayoutNavbar from './components/LayoutNavbar';
import LayoutNotifications from './components/LayoutNotifications';
import LayoutSidebar from './components/LayoutSidebar';

export default {
  components: {
    LayoutNavbar,
    LayoutNotifications,
    LayoutSidebar,
  },
  data: () => ({
    sidebar: {
      isOpen: false,
    },
  }),

  computed: {
    ...mapState({
      user: state => state.auth.user,
      notifications: state => state.common.notifications,
    }),
    ...mapGetters({
      loading: 'common/loading',
      sortedSidebarItems: 'common/sidebarItems/sorted',
      navbarTitle: 'common/title/navbar',
    }),
  },
};
</script>

<style lang="sass">
// Application wide theme overrides
.v-small-dialog__menu-content
  min-width: auto !important
</style>
