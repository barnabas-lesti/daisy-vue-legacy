<template lang="pug">
  v-app.app
    sidebar(
      v-model='sidebar.isOpen'
      :items='groupedSidebarItems'
    )

    v-app-bar(
      app
      dense
      clipped-left
    )
      v-app-bar-nav-icon(@click='sidebar.isOpen = !sidebar.isOpen')
      v-toolbar-title {{ $t('core.appTitle') }}

    v-content
      v-container(fluid)
        router-view

    v-footer(app)
</template>

<script>
import { mapGetters } from 'vuex';

import Sidebar from './components/sidebar/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data: () => ({
    sidebar: {
      isOpen: false,
    },
  }),

  computed: {
    ...mapGetters('core', [ 'groupedSidebarItems' ]),
  },
};
</script>
