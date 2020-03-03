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
        v-if="diaryItems && diaryItems.length > 0"
        :labels="labels"
        :datasets="datasets"
      )
      v-progress-circular(
        v-else-if="isLoading"
        color="primary"
        indeterminate
      )
      i18n(v-else, path="health.widgets.healthTrend.noItems")
        router-link(:to="{ name: 'health.diary.date', params: { dateString } }") {{ $t('health.widgets.healthTrend.noItemsLink') }}
</template>

<script>
import { mapState } from 'vuex';

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
    }
  },
  data () {
    return {
      trendType: this.initialTrendType,
      trendTypeOptions: Object.keys(trendTypes)
        .map(key => ({
          text: this.$t(`health.widgets.healthTrend.trendTypeOptions.${trendTypes[key]}`),
          value: trendTypes[key],
        })),
      isLoading: true,
    };
  },
  computed: {
    ...mapState('health', {
      diaryItems: state => state.diary.healthTrend.items,
    }),

    dateString: {
      get () { return this.$store.state.health.diary.healthTrend.dateString; },
      set (newDateString) {
        this.isLoading = true;
        this.$store.dispatch('health/diary/healthTrend/ensureItems', newDateString)
          .then(() => this.isLoading = false);
      },
    },

    datesOfWeek () {
      return DiaryItem.getDatesOfWeek(this.dateString);
    },
    diaryItemDates () {
      return this.diaryItems.map(item => item.dateString);
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
      for (let i = 0; i < this.datesOfWeek.length; i++) {
        const dateString = this.datesOfWeek[i].format(DiaryItem.DATE_FORMAT);
        const diaryItem = this.diaryItems.filter(item => item.dateString === dateString)[0];
        if (!diaryItem || diaryItem.items.length < 1) {
          nutrientData.push(null);
        } else {
          const nutrients = diaryItem.getNutrients();
          switch (nutrientName) {
            case nutrientNames.CALORIES: nutrientData.push(nutrients.calories); break;
            case nutrientNames.CARBS: nutrientData.push(nutrients.carbs); break;
            case nutrientNames.PROTEIN: nutrientData.push(nutrients.protein); break;
            case nutrientNames.FAT: nutrientData.push(nutrients.fat); break;
          }
        }
      }
      return nutrientData;
    },
  },
  created () {
    this.$store.dispatch('health/diary/healthTrend/ensureItems', this.dateString)
      .then(() => this.isLoading = false);
  },
};
</script>
