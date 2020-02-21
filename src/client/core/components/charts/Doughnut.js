import { Doughnut, mixins } from 'vue-chartjs';

export default {
  extends: Doughnut,
  mixins: [ mixins.reactiveProp ],
  props: {
    chartOptions: Object,
  },
  data () {
    return {
      options: {
        // Base setup, then component override

        ...this.chartOptions,
      },
    };
  },
  mounted () {
    this.renderChart(this.chartData, this.options);
  },
};
