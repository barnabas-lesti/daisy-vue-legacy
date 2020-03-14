<template lang="pug">
  .dashboard-health-trend-chart
    common-chart-line(
      :chart-data="chartData"
      :chart-options="chartOptions"
    )
</template>

<script>
import CommonChartLine from './CommonChartLine';

export default {
  components: {
    CommonChartLine,
  },
  props: {
    labels: Array,
    datasets: Array,
  },
  data () {
    const { colors } = this.$theme;
    return {
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: { beginAtZero: true },
          }],
        },
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
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
  },
};
</script>
