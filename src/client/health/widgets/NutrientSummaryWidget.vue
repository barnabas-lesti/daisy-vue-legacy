<template lang="pug">
  .nutrient-summary-widget
    widget-frame(
      v-model="dateString"
      :title="$t('health.widgets.nutrientSummary.title')"
      :caption="dateString"
      :loading="isLoading"
    )
      nutrient-summary-chart(
        v-if="diaryItem && diaryItem.items.length > 0"
        :summary="nutrientSummary"
        compact
        stretch
      )
      i18n(v-else-if="!isLoading", path="health.widgets.nutrientSummary.noItems")
        router-link(:to="{ name: 'health.diary.date', params: { dateString } }") {{ $t('health.widgets.nutrientSummary.noItemsLink') }}
</template>

<script>
import DiaryItem from '../models/diary-item';
import WidgetFrame from '../../core/components/WidgetFrame';
import NutrientSummaryChart from '../components/NutrientSummaryChart';

export default {
  name: 'NutrientSummaryWidget',
  components: {
    WidgetFrame,
    NutrientSummaryChart,
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
      return this.$store.state.health.diary.items.filter(item => item.dateString === this.dateString)[0] || this.diaryItemCache;
    },
    nutrientSummary () {
      return this.diaryItem && this.diaryItem.getNutrients();
    },
  },
  methods: {
    async updateItems (dateString) {
      this.isLoading = true;
      await this.$store.dispatch('health/diary/ensureItems', [ dateString ]);
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
.nutrient-summary-widget
  position: relative
  &__date-picker
    position: absolute
    top: 16px
    right: 16px
</style>
