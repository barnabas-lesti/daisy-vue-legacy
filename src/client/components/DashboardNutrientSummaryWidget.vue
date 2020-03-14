<template lang="pug">
  .dashboard-nutrient-summary-widget
    common-widget-frame(
      v-model="dateString"
      :title="$t('components.dashboardNutrientSummaryWidget.title')"
      :caption="dateString"
      :loading="isLoading"
    )
      diet-nutrient-summary-chart(
        v-if="diaryItem && diaryItem.items.length > 0"
        :summary="nutrientSummary"
        compact
        stretch
      )
      i18n(v-else-if="!isLoading", path="components.dashboardNutrientSummaryWidget.noItems")
        router-link(:to="{ name: 'diary.date', params: { dateString } }")
          | {{ $t('components.dashboardNutrientSummaryWidget.noItemsLink') }}
</template>

<script>
import DiaryItem from '../models/diary-item';
import CommonWidgetFrame from './CommonWidgetFrame';
import DietNutrientSummaryChart from './DietNutrientSummaryChart';

export default {
  name: 'NutrientSummaryWidget',
  components: {
    CommonWidgetFrame,
    DietNutrientSummaryChart,
  },
  props: {
    widgetId: String,
  },
  data () {
    const { dateString = DiaryItem.today() } = this.$storage.getFromLocalStorage(this.widgetId) || {};
    return {
      dateString,
      isLoading: true,
      diaryItemCache: null,
    };
  },
  computed: {
    diaryItem () {
      return this.$store.state.diary.items.filter(item => item.dateString === this.dateString)[0] || this.diaryItemCache;
    },
    nutrientSummary () {
      return this.diaryItem && this.diaryItem.getNutrients();
    },
  },
  methods: {
    async updateItems (dateString) {
      this.isLoading = true;
      await this.$store.dispatch('diary/items/ensure', [ dateString ]);
      this.diaryItemCache = this.diaryItem;
      this.$storage.saveToLocalStorage(this.widgetId, { dateString });
      this.isLoading = false;
    },
  },
  async created () {
    await this.updateItems(this.dateString);
  },
  watch: {
    async dateString (newDateString) {
      await this.updateItems(newDateString);
    },
  },
};
</script>

<style lang="sass">
.dashboard-nutrient-summary-widget
  position: relative
  &__date-picker
    position: absolute
    top: 16px
    right: 16px
</style>
