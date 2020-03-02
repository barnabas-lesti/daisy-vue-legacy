<template lang="pug">
  .health-dashboard
    v-row
      v-col
        nutrient-summary-widget
</template>

<script>
import NutrientSummaryWidget from '../../widgets/NutrientSummaryWidget';

export default {
  components: {
    NutrientSummaryWidget,
  },
};
</script>
