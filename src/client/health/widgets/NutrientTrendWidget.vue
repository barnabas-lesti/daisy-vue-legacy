<template lang="pug">
  v-card.nutrient-trend-widget
    v-card-title
      v-row(no-gutters)
        v-col.mb-4 {{ $t('health.widgets.nutrientTrend.title') }}
        v-col(:cols="$vuetify.breakpoint.xs ? 12 : ''")
          form-date-picker(
            v-model="dateString"
            :label="$t('health.widgets.nutrientTrend.date')"
            :loading="isLoading"
          )
    v-card-text
      nutrient-trend-chart(
        v-if="items && items.length > 0"
        :included-date-string="dateString"
        :diaryItems="items"
      )
      v-progress-circular(
        v-else-if="isLoading"
        color="primary"
        indeterminate
      )
      i18n(v-else, path="health.widgets.nutrientTrend.noItems")
        router-link(:to="{ name: 'health.diary' }") {{ $t('health.widgets.nutrientTrend.noItemsLink') }}
</template>

<script>
import { mapState } from 'vuex';

import FormDatePicker from '../../core/components/FormDatePicker';
import NutrientTrendChart from '../components/NutrientTrendChart';

export default {
  components: {
    FormDatePicker,
    NutrientTrendChart,
  },
  data () {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapState('health', {
      items: state => state.diary.nutrientTrend.items,
    }),

    dateString: {
      get () { return this.$store.state.health.diary.nutrientTrend.dateString; },
      set (newDateString) {
        this.isLoading = true;
        this.$store.dispatch('health/diary/nutrientTrend/ensureItems', newDateString)
          .then(() => this.isLoading = false);
      },
    },
  },
  created () {
    this.$store.dispatch('health/diary/nutrientTrend/ensureItems', this.dateString)
      .then(() => this.isLoading = false);
  },
};
</script>
