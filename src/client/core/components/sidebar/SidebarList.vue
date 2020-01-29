<template lang="pug">
  v-list.sidebar-list(flat)
    template(
      v-for="(group, index) in items"
    )
      v-divider(v-if="index > 0")
      sidebar-list-item(
        v-for="item in group"
        :key="item.label || item.labelKey"
        :item="item"
      )
</template>

<script>
import SidebarListItem from './SidebarListItem.vue';

export default {
  components: {
    SidebarListItem,
  },
  props: {
    items: Object,
  },
};
</script>
