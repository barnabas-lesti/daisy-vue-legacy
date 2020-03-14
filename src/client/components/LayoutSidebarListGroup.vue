<template lang="pug">
  v-list-group.layout-sidebar-list-group(
    :value="isActive"
    :prepend-icon="group.icon"
    :class="`list-group--${group.routeName.replace(/\\./i, '-')}`"
  )
    template(v-slot:activator)
      v-list-item-title {{ group.label || $t(group.labelKey) }}
    layout-sidebar-list-item(
      v-for="item in group.items"
      :key="item.label || item.labelKey"
      :item="item"
      dense
    )
</template>

<script>
import LayoutSidebarListItem from './LayoutSidebarListItem';

export default {
  components: {
    LayoutSidebarListItem,
  },
  props: {
    group: Object,
    activeRoute: String,
  },
  computed: {
    isActive () { return this.activeRoute.indexOf(this.group.routeName) !== -1; },
  },
};
</script>
