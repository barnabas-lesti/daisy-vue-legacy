<template lang="pug">
  .layout-notifications(:class="$vuetify.breakpoint.xs ? '' : 'layout-notifications__non-mobile'")
    v-alert(
      v-for="item in items"
      :key="item.id"
      :type="item.type || 'info'"
      :value="!item.fading"
      :icon="false"
      class="layout-notifications__item"
      tile
    ) {{ item.textKey ? $t(item.textKey) : item.text }}
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="sass">
.layout-notifications
  bottom: 0
  position: fixed
  right: 0
  width: 100%
  z-index: 1000

  &__non-mobile
    width: auto
    padding: 12px

  &__item
    &:last-of-type
      margin-bottom: 0
</style>
