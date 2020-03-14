<template lang="pug">
  .diet-nutrient-summary-chart(
    :class="[ stretch ? 'diet-nutrient-summary-chart--stretch' : '' ]"
  )
    v-row(v-if="!isSummaryEmpty")
      v-col(:cols="cols")
        common-chart-doughnut(
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
              .title {{ $t('components.dietNutrientSummaryChart.table.calories') }}
              .title.text-right
                | {{ formatValue(summary.calories) }} {{ $t('common.units.calories') }}
            v-simple-table.diet-nutrient-summary-chart__table
              tbody
                tr
                  td {{ $t('components.dietNutrientSummaryChart.table.carbs') }}
                  td.text-right {{ formatValue(summary.carbs) }} {{ $t('common.units.g') }}
                  td.text-right {{ getPercentage(summary.carbs) }} {{ $t('common.units.percent') }}
                tr
                  td {{ $t('components.dietNutrientSummaryChart.table.protein') }}
                  td.text-right {{ formatValue(summary.protein) }} {{ $t('common.units.g') }}
                  td.text-right {{ getPercentage(summary.protein) }} {{ $t('common.units.percent') }}
                tr
                  td {{ $t('components.dietNutrientSummaryChart.table.fat') }}
                  td.text-right {{ formatValue(summary.fat) }} {{ $t('common.units.g') }}
                  td.text-right {{ getPercentage(summary.fat) }} {{ $t('common.units.percent') }}
</template>

<script>
import DiaryItem from '../models/diary-item';
import CommonChartDoughnut from './CommonChartDoughnut';

export default {
  components: {
    CommonChartDoughnut,
  },
  props: {
    summary: Object,
    stretch: Boolean,
    compact: Boolean,
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
    cols () {
      const breakpointName = this.$vuetify.breakpoint.name;
      if (this.compact) {
        switch (breakpointName) {
          case 'xs':
          case 'sm': return 12;
          default: return 6;
        }
      } else {
        switch (breakpointName) {
          case 'xs': return 12;
          default: return 6;
        }
      }
    },
    isSummaryEmpty () {
      return DiaryItem.areNutrientsEmpty(this.summary);
    },
    chartData () {
      const { colors } = this.$theme;
      return {
        labels: [
          this.$t('components.dietNutrientSummaryChart.legend.carbs'),
          this.$t('components.dietNutrientSummaryChart.legend.protein'),
          this.$t('components.dietNutrientSummaryChart.legend.fat'),
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
.diet-nutrient-summary-chart
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
