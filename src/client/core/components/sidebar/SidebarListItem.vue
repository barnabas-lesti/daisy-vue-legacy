<template lang="pug">
  v-list-item.sidebar-list-item(
    :to="{ name: item.routeToName }"
    color="primary"
    link
    dense
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
  },
};
</script>
