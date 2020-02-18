<template lang="pug">
  v-list-group.sidebar-list-group(
    :key="forceRefreshKey"
    :prepend-icon="group.icon"
    :group="getActivePath()"
    @click="onClick($event)"
  )
    template(v-slot:activator)
      v-list-item-title {{ group.label || $t(group.labelKey) }}
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
  data () {
    return {
      forceRefreshKey: this.generateKey(),
      listGroupValue: false,
    };
  },
  methods: {
    generateKey: () => new Date().getTime(),
    forceUpdate () {
      // Built in force update doesn't work... :(
      this.forceRefreshKey = this.generateKey();
    },
    getActivePath () {
      const { route } = this.$router.resolve({ name: this.group.routeName });
      return route.path;
    },

    onClick (event) {
      if (this.$route.name !== this.group.routeName) {
        this.$router.push({ name: this.group.routeName });
      }
      this.forceUpdate();
    },
  },
};
</script>
