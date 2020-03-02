<template lang="pug">
  .health-dashboard
    v-row
      v-col
        nutrient-summary-widget
      v-col
        nutrient-trend-widget
</template>

<script>
import NutrientSummaryWidget from '../../widgets/NutrientSummaryWidget';
import NutrientTrendWidget from '../../widgets/NutrientTrendWidget';

export default {
  components: {
    NutrientSummaryWidget,
    NutrientTrendWidget,
  },
};
</script>
