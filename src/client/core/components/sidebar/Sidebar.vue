<template lang="pug">
  .sidebar
    v-navigation-drawer(
      v-if="$vuetify.breakpoint.xs"
      v-model="model"
      app
      clipped
    )
      list(:items="items")
    v-navigation-drawer(
      v-else
      :mini-variant="!model"
      permanent
      app
      clipped
    )
      list(:items="items")

</template>

<script>
import List from './List.vue';

export default {
  components: {
    List,
  },
  props: {
    value: Boolean,
    items: Array,
  },
  computed: {
    model: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
};
</script>
