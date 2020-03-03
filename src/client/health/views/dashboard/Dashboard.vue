<template lang="pug">
  .health-dashboard
    v-row
      v-col(:cols="cols")
        nutrient-summary-widget
      v-col(:cols="cols")
        health-trend-widget(initial-trend-type="macros")
</template>

<script>
import NutrientSummaryWidget from '../../widgets/NutrientSummaryWidget';
import HealthTrendWidget from '../../widgets/HealthTrendWidget';

export default {
  components: {
    NutrientSummaryWidget,
    HealthTrendWidget,
  },
  computed: {
    cols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return 6;
        default: return 12;
      }
    },
  },
};
</script>
