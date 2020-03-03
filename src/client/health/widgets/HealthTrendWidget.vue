<template lang="pug">
  v-card.health-trend-widget
    v-card-title
      v-row(no-gutters)
        v-col.mb-4 {{ $t('health.widgets.healthTrend.title') }}
        v-col(:cols="$vuetify.breakpoint.xs ? 12 : ''")
          v-select(
            v-model="trendType"
            :items="trendTypeOptions"
            :label="$t('health.widgets.healthTrend.trendTypes')"
            :prepend-icon="$theme.icons.mdiFinance"
            :disabled="isLoading"
            name="trendTypes"
          )
          form-date-picker(
            v-model="dateString"
            :label="$t('health.widgets.healthTrend.date')"
            :loading="isLoading"
          )
    v-card-text
      health-trend-chart(
        v-if="diaryItems.length > 0"
        :labels="labels"
        :datasets="datasets"
      )
      .d-flex.align-center.justify-center.pa-4(v-else-if="isLoading")
        v-progress-circular(
          color="primary"
          indeterminate
        )
</template>

<script>
import DiaryItem from '../models/diary-item';
import FormDatePicker from '../../core/components/FormDatePicker';
import HealthTrendChart from '../components/HealthTrendChart';

const nutrientNames = {
  CALORIES: 'calories',
  CARBS: 'carbs',
  PROTEIN: 'protein',
  FAT: 'fat',
};

const trendTypes = {
  CALORIES: 'calories',
  MACROS: 'macros',
};

export default {
  components: {
    FormDatePicker,
    HealthTrendChart,
  },
  props: {
    initialTrendType: {
      type: String,
      default: () => trendTypes.CALORIES,
    },
  },
  data () {
    return {
      trendType: this.initialTrendType,
      trendTypeOptions: Object.keys(trendTypes).map(key => ({
        text: this.$t(`health.widgets.healthTrend.trendTypeOptions.${trendTypes[key]}`),
        value: trendTypes[key],
      })),

      isLoading: true,
      dateString: DiaryItem.today(),
      diaryItemsCache: [],
    };
  },
  computed: {
    datesOfWeek () {
      return DiaryItem.getDatesOfWeek(this.dateString);
    },
    dateStringsOfWeek () {
      return this.datesOfWeek.map(date => DiaryItem.convertDateToDateString(date));
    },
    diaryItems () {
      const diaryItemsFromStore = this.$store.getters['health/diary/items/sorted']
        .filter(item => this.dateStringsOfWeek.indexOf(item.dateString) !== -1);
      return diaryItemsFromStore.length > 0 ? diaryItemsFromStore : this.diaryItemsCache;
    },

    labels () {
      return this.datesOfWeek.map(date => {
        const dayOfWeek = date.format('e');
        const dayOfMonth = date.format('DD');
        return this.$t(`health.components.healthTrendChart.legend.days.${dayOfWeek}`, [ dayOfMonth ]);
      });
    },
    datasets () {
      const { CALORIES, CARBS, PROTEIN, FAT } = nutrientNames;
      const { colors } = this.$theme;
      switch (this.trendType) {
        case trendTypes.MACROS:
          return [
            this.getDatasetOptions(CARBS, colors.lightBlue.lighten2, this.getNutrientData(CARBS)),
            this.getDatasetOptions(PROTEIN, colors.red.lighten2, this.getNutrientData(PROTEIN)),
            this.getDatasetOptions(FAT, colors.orange.lighten2, this.getNutrientData(FAT)),
          ];
        default:
          return [
            this.getDatasetOptions(CALORIES, colors.lightBlue.lighten2, this.getNutrientData(CALORIES)),
          ];
      }
    },
  },
  methods: {
    getDatasetOptions (nutrientName, color, data) {
      return {
        label: this.$t(`health.components.healthTrendChart.legend.labels.${nutrientName}`),
        borderColor: color,
        fill: false,
        data,
      };
    },
    getNutrientData (nutrientName) {
      const nutrientData = [];
      for (let i = 0; i < this.diaryItems.length; i++) {
        const diaryItem = this.diaryItems[i];
        const nutrients = diaryItem.getNutrients();
        if (DiaryItem.areNutrientsEmpty(nutrients)) {
          nutrientData.push(null);
        } else {
          switch (nutrientName) {
            case nutrientNames.CALORIES: nutrientData.push(this.formatValue(nutrients.calories)); break;
            case nutrientNames.CARBS: nutrientData.push(this.formatValue(nutrients.carbs)); break;
            case nutrientNames.PROTEIN: nutrientData.push(this.formatValue(nutrients.protein)); break;
            case nutrientNames.FAT: nutrientData.push(this.formatValue(nutrients.fat)); break;
          }
        }
      }
      return nutrientData;
    },
    formatValue (value) {
      return parseFloat(value).toFixed(2);
    },
  },
  async created () {
    this.isLoading = true;
    await this.$store.dispatch('health/diary/ensureItems', [ ...this.dateStringsOfWeek ]);
    this.diaryItemsCache = [ ...this.diaryItems ];
    this.isLoading = false;
  },
  watch: {
    async 'dateString' () {
      this.isLoading = true;
      await this.$store.dispatch('health/diary/ensureItems', [ ...this.dateStringsOfWeek ]);
      this.diaryItemsCache = [ ...this.diaryItems ];
      this.isLoading = false;
    },
  },
};
</script>
