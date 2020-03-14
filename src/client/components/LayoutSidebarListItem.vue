<template lang="pug">
  v-list-item.layout-sidebar-list-item(
    :to="{ name: item.routeName }"
    :class="`layout-sidebar-list-item--${item.routeName.replace(/\\./i, '-')}`"
    color="primary"
    link
    :dense="dense"
  )
    v-list-item-icon
      v-icon {{ item.icon }}
    v-list-item-content
      v-list-item-title {{ item.label || $t(item.labelKey) }}
</template>

<script>
export default {
  props: {
    item: Object,
    dense: Boolean,
  },
};
</script>
