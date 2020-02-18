<template lang="pug">
  .sidebar
    v-navigation-drawer(
      v-if="$vuetify.breakpoint.xs"
      v-model="model"
      app
      clipped
    )
      sidebar-list(:items="items")
    v-navigation-drawer(
      v-else
      :mini-variant="!model"
      permanent
      app
      clipped
    )
      sidebar-list(:items="items")

</template>

<script>
import SidebarList from './SidebarList.vue';

export default {
  components: {
    SidebarList,
  },
  props: {
    value: Boolean,
    items: Array,
  },
  computed: {
    model: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
};
</script>
