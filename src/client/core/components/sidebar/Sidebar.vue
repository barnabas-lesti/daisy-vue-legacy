<template lang="pug">
  .sidebar
    v-navigation-drawer(
      v-if="$vuetify.breakpoint.xs"
      v-model="model"
      app
      clipped
    )
      v-list-item
        v-list-item-icon
          v-btn(
            v-if="loading"
            color="primary"
            loading
            icon
            small
          )
          v-btn(
            v-else
            color="primary"
            icon
            small
            @click="close()"
          )
            v-icon {{ $theme.icons.mdiMenu }}
        v-list-item-content
          v-list-item-title.title {{ $t('core.appTitle') }}
      v-divider
      list(
        :items="items"
        :active-route="activeRoute"
      )
    v-navigation-drawer(
      v-else
      :mini-variant="!model"
      permanent
      app
      clipped
    )
      list(
        :items="items"
        :active-route="activeRoute"
      )

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
    activeRoute: String,
    loading: Boolean,
  },
  computed: {
    model: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
  methods: {
    close () { this.model = false; },
  },
};
</script>
