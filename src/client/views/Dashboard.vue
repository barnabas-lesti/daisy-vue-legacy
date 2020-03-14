<template lang="pug">
  .dashboard
    v-row
      v-col(:cols="widgetCols")
        dashboard-nutrient-summary-widget(widget-id="dashboard/nutrientSummaryWidget/1")
      v-col(:cols="widgetCols")
        dashboard-health-trend-widget(widget-id="dashboard/healthTrendWidget/1")
</template>

<script>
import DashboardHealthTrendWidget from '../components/DashboardHealthTrendWidget';
import DashboardNutrientSummaryWidget from '../components/DashboardNutrientSummaryWidget';

export default {
  components: {
    DashboardHealthTrendWidget,
    DashboardNutrientSummaryWidget,
  },
  computed: {
    widgetCols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12;
        default: return 6;
      }
    },
  },
};
</script>
