<template lang="pug">
  .layout-sidebar
    v-navigation-drawer(
      v-if="$vuetify.breakpoint.xs"
      v-model="model"
      app
      clipped
    )
      v-list-item
        v-list-item-icon
          v-btn(
            v-if="loading"
            color="primary"
            loading
            icon
            small
          )
          v-btn(
            v-else
            color="primary"
            icon
            small
            @click="close()"
          )
            v-icon {{ $theme.icons.mdiMenu }}
        v-list-item-content
          v-list-item-title.title {{ $t('common.appTitle') }}
      v-divider
      layout-sidebar-list(
        :items="items"
        :active-route="activeRoute"
      )
    v-navigation-drawer(
      v-else
      :mini-variant="!model"
      permanent
      app
      clipped
    )
      layout-sidebar-list(
        :items="items"
        :active-route="activeRoute"
      )

</template>

<script>
import LayoutSidebarList from './LayoutSidebarList';

export default {
  components: {
    LayoutSidebarList,
  },
  props: {
    value: Boolean,
    items: Array,
    activeRoute: String,
    loading: Boolean,
  },
  computed: {
    model: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
  methods: {
    close () { this.model = false; },
  },
};
</script>
