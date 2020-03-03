<template lang="pug">
  .health-trend-chart
    line-chart(
      :chart-data="chartData"
      :chart-options="chartOptions"
    )
</template>

<script>
import LineChart from '../../core/components/charts/Line';

export default {
  components: {
    LineChart,
  },
  props: {
    labels: Array,
    datasets: Array,
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
      return {
        labels: this.labels,
        datasets: this.datasets,
      };
    },
  },
};
</script>
