<template lang="pug">
  v-card.nutrient-summary-widget
    v-card-title
      v-row(no-gutters)
        v-col.mb-4 {{ $t('health.widgets.nutrientSummary.title') }}
        v-col(:cols="$vuetify.breakpoint.xs ? 12 : ''")
          form-date-picker(
            v-model="dateString"
            :label="$t('health.widgets.nutrientSummary.date')"
            :loading="isLoading"
          )
    v-card-text
      nutrient-summary-chart(
        v-if="diaryItem && diaryItem.items.length > 0"
        :summary="nutrientSummary"
        stretch
      )
      .d-flex.align-center.justify-center.pa-4(v-else-if="isLoading")
        v-progress-circular(
          color="primary"
          indeterminate
        )
      i18n(v-else, path="health.widgets.nutrientSummary.noItems")
        router-link(:to="{ name: 'health.diary.date', params: { dateString } }") {{ $t('health.widgets.nutrientSummary.noItemsLink') }}
</template>

<script>
import DiaryItem from '../models/diary-item';
import FormDatePicker from '../../core/components/FormDatePicker';
import NutrientSummaryChart from '../components/NutrientSummaryChart';

export default {
  components: {
    FormDatePicker,
    NutrientSummaryChart,
  },
  data () {
    return {
      isLoading: true,
      dateString: DiaryItem.today(),
      diaryItemCache: null,
    };
  },
  computed: {
    diaryItem () {
      return this.$store.state.health.diary.items.filter(item => item.dateString === this.dateString)[0] || this.diaryItemCache;
    },
    nutrientSummary () {
      return this.diaryItem && this.diaryItem.getNutrients();
    },
  },
  async created () {
    this.isLoading = true;
    await this.$store.dispatch('health/diary/ensureItems', [ this.dateString ]);
    this.diaryItemCache = this.diaryItem;
    this.isLoading = false;
  },
  watch: {
    async 'dateString' (newDateString) {
      this.isLoading = true;
      await this.$store.dispatch('health/diary/ensureItems', [ newDateString ]);
      this.diaryItemCache = this.diaryItem;
      this.isLoading = false;
    },
  },
};
</script>
