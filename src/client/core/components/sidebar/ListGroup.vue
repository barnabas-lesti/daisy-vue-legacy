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
