<template lang="pug">
  v-navigation-drawer.sidebar(
    :mini-variant='!model'
    app
    permanent
    clipped
  )
    v-list(flat)
      template(
        v-for='(group, index) in items'
      )
        v-divider(v-if='index > 0')
        sidebar-list-item(
          v-for='item in group'
          :key='item.label || item.labelKey'
          :item='item'
        )
</template>

<script>
import SidebarListItem from './SidebarListItem.vue';

export default {
  components: {
    SidebarListItem,
  },
  props: {
    value: Boolean,
    items: Object,
  },
  computed: {
    model: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
};
</script>
