<template lang="pug">
  v-list-group.list-group(
    :value="isActive"
    :prepend-icon="group.icon"
    :class="`list-group--${group.routeName.replace(/\\./i, '-')}`"
  )
    template(v-slot:activator)
      v-list-item-title {{ group.label || $t(group.labelKey) }}
    list-item(
      v-for="item in group.items"
      :key="item.label || item.labelKey"
      :item="item"
      dense
    )
</template>

<script>
import ListItem from './ListItem.vue';

export default {
  components: {
    ListItem,
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
