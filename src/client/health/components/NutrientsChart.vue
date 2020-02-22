<template lang="pug">
  .nutrients-chart
    v-row
      v-col(
        sm="6"
        md="4"
      )
        doughnut-chart(
          :chart-data="chartData"
          :chart-options="chartOptions"
        )
      v-col(
        sm="6"
        md="4"
      )
        v-card
          v-card-text
            v-simple-table.nutrients-chart__table
              tbody
                tr
                  td.title {{ $t('health.components.nutrientsChart.table.calories') }}
                  td
                  td.title.text-right {{ formatValue(nutrients.calories) }} cal
                tr
                  td {{ $t('health.components.nutrientsChart.table.carbs') }}
                  td.text-right {{ formatValue(nutrients.carbs) }} g
                  td.text-right {{ getPercentage(nutrients.carbs) }} %
                tr
                  td {{ $t('health.components.nutrientsChart.table.protein') }}
                  td.text-right {{ formatValue(nutrients.protein) }} g
                  td.text-right {{ getPercentage(nutrients.protein) }} %
                tr
                  td {{ $t('health.components.nutrientsChart.table.fat') }}
                  td.text-right {{ formatValue(nutrients.fat) }} g
                  td.text-right {{ getPercentage(nutrients.fat) }} %
</template>

<script>
import Food from '../models/food';
import DoughnutChart from '../../core/components/charts/Doughnut';

export default {
  components: {
    DoughnutChart,
  },
  props: {
    nutrients: Food.Nutrients,
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
    chartData () {
      const { colors } = this.$theme;
      return {
        labels: [
          this.$t('health.components.nutrientsChart.legend.carbs'),
          this.$t('health.components.nutrientsChart.legend.protein'),
          this.$t('health.components.nutrientsChart.legend.fat'),
        ],
        datasets: [{
          data: [
            this.formatValue(this.nutrients.carbs),
            this.formatValue(this.nutrients.protein),
            this.formatValue(this.nutrients.fat),
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
      const { carbs, protein, fat } = this.nutrients;
      const total = carbs + protein + fat;
      return this.formatValue(nutrient / total * 100);
    },
    formatValue (value) {
      return parseFloat(value).toFixed(2);
    },
  },
};
</script>

<style lang="sass">
.nutrients-chart
  &__table
    th:first-of-type, td:first-of-type
      padding-left: 0

    th:last-of-type, td:last-of-type
      padding-right: 0

</style>
