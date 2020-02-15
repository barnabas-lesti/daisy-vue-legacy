<template lang="pug">
  v-app.app
    sidebar(
      v-if='user'
      v-model='sidebar.isOpen'
      :items='groupedSidebarItems'
    )

    navbar(
      v-if='user'
      :user='user'
      @toggle-sidebar='sidebar.isOpen = !sidebar.isOpen'
    )

    v-content
      v-container(fluid)
        v-breadcrumbs.ma-0.pa-0(
          v-if="user && breadcrumbs && breadcrumbs.length > 0"
          :items="breadcrumbs"
        )
        router-view

    v-footer(app)
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Navbar from './components/navbar/Navbar.vue';
import Sidebar from './components/sidebar/Sidebar.vue';

export default {
  components: {
    Navbar,
    Sidebar,
  },
  data: () => ({
    sidebar: {
      isOpen: false,
    },
  }),

  computed: {
    ...mapState('core', [ 'user', 'breadcrumbs' ]),
    ...mapGetters('core', [ 'groupedSidebarItems' ]),
  },
};
</script>
