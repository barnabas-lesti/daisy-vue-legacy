<template lang="pug">
  v-list-group.sidebar-list-group(
    :value="isActive"
    :prepend-icon="group.icon"
  )
    template(v-slot:activator)
      v-list-item-title(:data-qa="`sidebar.${group.routeName}.link`") {{ group.label || $t(group.labelKey) }}
    sidebar-list-item(
      v-for="item in group.items"
      :key="item.label || item.labelKey"
      :item="item"
      dense
    )
</template>

<script>
import SidebarListItem from './SidebarListItem.vue';

export default {
  components: {
    SidebarListItem,
  },
  props: {
    group: Object,
  },
  computed: {
    isActive () {
      return this.$route.path.indexOf(this.getActivePath()) !== -1;
    },
  },
  methods: {
    getActivePath () {
      const { route } = this.$router.resolve({ name: this.group.routeName });
      return route.path;
    },
  },
};
</script>
