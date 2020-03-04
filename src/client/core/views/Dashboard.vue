<template lang="pug">
  .dashboard
    .d-block(
      v-for="(widgetGroup, key) in widgetGroups"
      :key="key"
    )
      h2 {{ $t(key) }}
      v-row
        v-col(
          v-for="widget in widgetGroup"
          :key="widget.id"
          :cols="widgetCols"
        )
          component(
            :is="widget.Component.name"
            :widget-id="widget.id"
          )
</template>

<script>
import widgetRepo from '../plugins/widget-repo';

export default {
  components: {
    ...widgetRepo.getWidgetComponentObjects(),
  },
  computed: {
    widgetCols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12;
        default: return 6;
      }
    },
    widgetGroups () {
      return widgetRepo.getWidgetGroups();
    },
  },
  created () {
    console.log();
  },
};
</script>
