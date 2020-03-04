<template lang="pug">
  v-card.health-trend-widget
    v-card-title.d-block
      .title.pr-8 {{ $t('health.widgets.healthTrend.title') }}
      .caption {{ dateRangeString }}
      .health-trend-widget__date-picker
        form-date-picker(
          v-model="dateString"
          :label="$t('health.widgets.healthTrend.date')"
          :loading="isLoading"
          only-icon
        )
    v-card-text
      .d-block
        v-select(
          v-model="trendType"
          :items="trendTypeOptions"
          :label="$t('health.widgets.healthTrend.trendTypes')"
          :prepend-icon="$theme.icons.mdiFinance"
          :disabled="isLoading"
          name="trendTypes"
        )
      health-trend-chart(
        v-if="diaryItems.length > 0"
        :labels="labels"
        :datasets="datasets"
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
  name: 'HealthTrendWidget',
  components: {
    FormDatePicker,
    HealthTrendChart,
  },
  props: {
    widgetId: String,
  },
  data () {
    const storedSettings = this.$storage.getFromLocalStorage(this.widgetId) || {};
    const { trendType = trendTypes.CALORIES, dateString = DiaryItem.today() } = storedSettings;
    return {
      dateString,
      trendType,
      trendTypeOptions: this.getTrendTypeOptions(),
      isLoading: true,
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
    dateRangeString () {
      return `${this.dateStringsOfWeek[0]} / ${this.dateStringsOfWeek[this.dateStringsOfWeek.length - 1]}`;
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
    getTrendTypeOptions () {
      return Object.keys(trendTypes).map(key => ({
        text: this.$t(`health.widgets.healthTrend.trendTypeOptions.${trendTypes[key]}`),
        value: trendTypes[key],
      }));
    },
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

    async updateItems () {
      this.isLoading = true;
      await this.$store.dispatch('health/diary/ensureItems', [ ...this.dateStringsOfWeek ]);
      this.diaryItemsCache = [ ...this.diaryItems ];
      this.isLoading = false;
    },
  },
  async created () {
    await this.updateItems();
  },
  watch: {
    async dateString () {
      await this.updateItems();
      this.$storage.saveToLocalStorage(this.widgetId, { dateString: this.dateString });
    },
    async trendType () {
      this.$storage.saveToLocalStorage(this.widgetId, { trendType: this.trendType });
    },
  },
};
</script>

<style lang="sass">
.health-trend-widget
  position: relative
  &__date-picker
    position: absolute
    top: 16px
    right: 16px
</style>
