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
      v-progress-circular(
        v-else-if="isLoading"
        color="primary"
        indeterminate
      )
      i18n(v-else, path="health.widgets.nutrientSummary.noItems")
        router-link(:to="{ name: 'health.diary.date', params: { dateString } }") {{ $t('health.widgets.nutrientSummary.noItemsLink') }}
</template>

<script>
import { mapState } from 'vuex';

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
    };
  },
  computed: {
    ...mapState('health', {
      diaryItem: state => state.diary.item,
    }),

    dateString: {
      get () { return this.diaryItem ? this.diaryItem.dateString : ''; },
      set (newDateString) {
        this.isLoading = true;
        this.$store.dispatch('health/diary/ensureItem', newDateString)
          .then(() => this.isLoading = false);
      },
    },
    nutrientSummary () {
      return this.diaryItem && this.diaryItem.getNutrients();
    },
  },
  created () {
    this.$store.dispatch('health/diary/ensureItem')
      .then(() => this.isLoading = false);
  },
};
</script>
