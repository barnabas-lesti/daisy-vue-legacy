<template lang="pug">
  .nutrient-summary-chart(
    :class="[ stretch ? 'nutrient-summary-chart--stretch' : '' ]"
  )
    v-row(v-if="!isSummaryEmpty")
      v-col(:cols="cols")
        doughnut-chart(
          :chart-data="chartData"
          :chart-options="chartOptions"
        )
      v-col(:cols="cols")
        v-card(
          tile
          :flat="stretch"
        )
          v-card-text
            .d-flex.justify-space-between.black--text
              .title {{ $t('health.components.nutrientSummaryChart.table.calories') }}
              .title.text-right
                | {{ formatValue(summary.calories) }} {{ $t('health.common.units.calories') }}
            v-simple-table.nutrient-summary-chart__table
              tbody
                tr
                  td {{ $t('health.components.nutrientSummaryChart.table.carbs') }}
                  td.text-right {{ formatValue(summary.carbs) }} {{ $t('health.common.units.g') }}
                  td.text-right {{ getPercentage(summary.carbs) }} {{ $t('health.common.units.percent') }}
                tr
                  td {{ $t('health.components.nutrientSummaryChart.table.protein') }}
                  td.text-right {{ formatValue(summary.protein) }} {{ $t('health.common.units.g') }}
                  td.text-right {{ getPercentage(summary.protein) }} {{ $t('health.common.units.percent') }}
                tr
                  td {{ $t('health.components.nutrientSummaryChart.table.fat') }}
                  td.text-right {{ formatValue(summary.fat) }} {{ $t('health.common.units.g') }}
                  td.text-right {{ getPercentage(summary.fat) }} {{ $t('health.common.units.percent') }}
</template>

<script>
import DiaryItem from '../models/diary-item';
import DoughnutChart from '../../core/components/charts/Doughnut';

export default {
  components: {
    DoughnutChart,
  },
  props: {
    summary: Object,
    stretch: Boolean,
  },
  data () {
    const { colors } = this.$theme;
    return {
      chartOptions: {
        legend: {
          position: 'bottom',
          labels: {
            fontFamily: '"Roboto", sans-serif',
            padding: 16,
            boxWidth: 16,
            fontColor: colors.shades.black,
          },
        },
      },
    };
  },
  computed: {
    isSummaryEmpty () {
      return DiaryItem.areNutrientsEmpty(this.summary);
    },
    cols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'sm': return 6;
        default: return 12;
      }
    },
    chartData () {
      const { colors } = this.$theme;
      return {
        labels: [
          this.$t('health.components.nutrientSummaryChart.legend.carbs'),
          this.$t('health.components.nutrientSummaryChart.legend.protein'),
          this.$t('health.components.nutrientSummaryChart.legend.fat'),
        ],
        datasets: [{
          data: [
            this.formatValue(this.summary.carbs),
            this.formatValue(this.summary.protein),
            this.formatValue(this.summary.fat),
          ],
          backgroundColor: [
            colors.lightBlue.lighten2,
            colors.red.lighten2,
            colors.orange.lighten2,
          ],
        }],
      };
    },
  },
  methods: {
    getPercentage (nutrient) {
      const { carbs, protein, fat } = this.summary;
      const total = carbs + protein + fat;
      if (!nutrient || !total) return 0;
      return this.formatValue(nutrient / total * 100);
    },
    formatValue (value) {
      return parseFloat(value).toFixed(2);
    },
  },
};
</script>

<style lang="sass">
.nutrient-summary-chart
  &__table
    th:first-of-type, td:first-of-type
      padding-left: 0

    th:last-of-type, td:last-of-type
      padding-right: 0

  &--stretch
    .v-card__text
      padding-left: 0
      padding-right: 0

</style>
