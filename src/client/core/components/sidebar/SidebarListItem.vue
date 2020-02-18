<template lang="pug">
  v-list-item.sidebar-list-item(
    :to="{ name: item.routeName }"
    color="primary"
    :data-qa="`sidebar.${item.routeName}.link`"
    :exact="item.exact !== undefined ? item.exact : true"
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
