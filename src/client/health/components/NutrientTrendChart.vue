<template lang="pug">
  .nutrient-trend-chart
    line-chart(
      :chart-data="chartData"
      :chart-options="chartOptions"
    )
</template>

<script>
import DiaryItem from '../models/diary-item';
import LineChart from '../../core/components/charts/Line';

const nutrientNames = {
  CALORIES: 'calories',
  CARBS: 'carbs',
  PROTEIN: 'protein',
  FAT: 'fat',
};

export default {
  components: {
    LineChart,
  },
  props: {
    includedDateString: String,
    diaryItems: {
      type: Array,
      default: () => [],
    },
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
    datesOfWeek () {
      return DiaryItem.getDatesOfWeek(this.includedDateString);
    },
    diaryItemDates () {
      return this.diaryItems.map(item => item.dateString);
    },
    chartData () {
      const { CALORIES, CARBS, PROTEIN, FAT } = nutrientNames;
      const { colors } = this.$theme;
      return {
        labels: [
          ...this.getLabels(),
        ],
        datasets: [
          this.getDatasetOptions(CALORIES, colors.teal.lighten2, this.getNutrientData(CALORIES)),
          this.getDatasetOptions(CARBS, colors.lightBlue.lighten2, this.getNutrientData(CARBS)),
          this.getDatasetOptions(PROTEIN, colors.red.lighten2, this.getNutrientData(PROTEIN)),
          this.getDatasetOptions(FAT, colors.orange.lighten2, this.getNutrientData(FAT)),
        ],
      };
    },
  },
  methods: {
    getLabels (day) {
      return this.datesOfWeek.map(date => {
        const dayOfWeek = date.format('e');
        const dayOfMonth = date.format('DD');
        return this.$t(`health.components.nutrientTrendChart.legend.days.${dayOfWeek}`, [ dayOfMonth ]);
      });
    },
    getDatasetOptions (nutrientName, color, data) {
      return {
        label: this.$t(`health.components.nutrientTrendChart.legend.labels.${nutrientName}`),
        borderColor: color,
        fill: false,
        data,
      };
    },
    getNutrientData (nutrientName) {
      const nutrientData = [];
      for (let i = 0; i < this.datesOfWeek.length; i++) {
        const dateString = this.datesOfWeek[i].format(DiaryItem.DATE_FORMAT);
        const data = this.diaryItems.filter(item => item.dateString === dateString)[0];
        const nutrients = data ? data.getNutrients() : {};
        switch (nutrientName) {
          case nutrientNames.CALORIES: nutrientData.push(nutrients.calories); break;
          case nutrientNames.CARBS: nutrientData.push(nutrients.carbs); break;
          case nutrientNames.PROTEIN: nutrientData.push(nutrients.protein); break;
          case nutrientNames.FAT: nutrientData.push(nutrients.fat); break;
        }
      }
      return nutrientData;
    },
  },
};
</script>
