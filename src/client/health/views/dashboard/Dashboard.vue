<template lang="pug">
  .health-dashboard
    v-row
      v-col(md="6")
        nutrient-summary-widget(widget-id="health/dashboard/summaryWidget")
      v-col(md="6")
        health-trend-widget(
          widget-id="health/dashboard/trendWidget1"
          initial-trend-type="macros"
        )
</template>

<script>
import NutrientSummaryWidget from '../../widgets/NutrientSummaryWidget';
import HealthTrendWidget from '../../widgets/HealthTrendWidget';

export default {
  components: {
    NutrientSummaryWidget,
    HealthTrendWidget,
  },
};
</script>
