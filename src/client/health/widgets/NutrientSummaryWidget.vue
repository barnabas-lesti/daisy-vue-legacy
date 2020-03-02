<template lang="pug">
  v-card.nutrient-summary-widget
    v-card-title
      v-row
        v-col {{ $t('health.widgets.nutrientSummary.title') }}
        v-col(:cols="$vuetify.breakpoint.xs ? 12 : ''")
          form-date-picker(
            v-model="dateString"
            :label="$t('health.widgets.nutrientSummary.date')"
            :loading="itemLoading"
          )
    v-card-text
      nutrients-chart(
        v-if="nutrientSummary"
        :nutrients="nutrientSummary"
        stretch
      )
      i18n(v-else, path="health.widgets.nutrientSummary.noItems")
        router-link(:to="{ name: 'health.diary' }") {{ $t('health.widgets.nutrientSummary.noItemsLink') }}
</template>

<script>
import { mapState } from 'vuex';

import FormDatePicker from '../../core/components/FormDatePicker';
import NutrientsChart from '../components/NutrientsChart';

export default {
  components: {
    FormDatePicker,
    NutrientsChart,
  },
  data () {
    return {
      itemLoading: true,
    };
  },
  computed: {
    ...mapState('health', {
      diaryItem: state => state.diary.item,
    }),

    nutrientSummary () {
      return this.diaryItem ? this.diaryItem.getNutrients() : null;
    },
    dateString: {
      get () { return this.diaryItem ? this.diaryItem.dateString : ''; },
      set (newDateString) {
        this.itemLoading = true;
        this.$store.dispatch('health/diary/ensureItem', newDateString)
          .then(() => this.itemLoading = false);
      },
    },
  },
  created () {
    this.$store.dispatch('health/diary/ensureItem')
      .then(() => this.itemLoading = false);
  },
};
</script>
