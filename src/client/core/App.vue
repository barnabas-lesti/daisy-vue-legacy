<template lang="pug">
  v-app.app
    sidebar(
      v-if='user'
      v-model='sidebar.isOpen'
      :items='groupedSidebarItems'
    )

    nav-bar(
      v-if='user'
      :user='user'
      @toggle-sidebar='sidebar.isOpen = !sidebar.isOpen'
    )

    v-content
      v-container(fluid)
        router-view

    v-footer(app)
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import NavBar from './components/nav-bar/NavBar.vue';
import Sidebar from './components/sidebar/Sidebar.vue';

export default {
  components: {
    NavBar,
    Sidebar,
  },
  data: () => ({
    sidebar: {
      isOpen: false,
    },
  }),

  computed: {
    ...mapState('core', [ 'user' ]),
    ...mapGetters('core', [ 'groupedSidebarItems' ]),
  },
};
</script>
