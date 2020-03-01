<template lang="pug">
  .diary.view
    v-row
      v-col
        h1 {{ $t('health.views.diary.title') }}
      v-col.d-flex.justify-sm-end(
        :cols="$vuetify.breakpoint.xs ? 12 : ''"
      )
        .diary__date-picker(:class="[ !$vuetify.breakpoint.xs ? 'diary__date-picker--narrow' : '' ]")
        form-date-picker(
          v-model="dateString"
          :label="$t('health.views.diary.datePicker')"
          :loading="loading"
        )

    v-row(v-if="nutrientSummary")
      v-col
        nutrients-chart.diary__summary(:nutrients="nutrientSummary")

    v-row
      v-col(v-if="!$vuetify.breakpoint.xs")
        v-btn.mr-4(
          color="green lighten-2"
          small
          fab
          dark
          @click="saveItem()"
        )
          v-icon {{ $theme.icons.mdiCheck }}
        v-btn.mr-4.diary__open-select-modal(
          color="teal lighten-2"
          small
          fab
          dark
          @click="openSelectModal()"
        )
          v-icon {{ $theme.icons.mdiPlus }}
        v-btn(
          color="red lighten-2"
          small
          fab
          dark
          @click="onRemoveClick()"
        )
          v-icon {{ $theme.icons.mdiPlaylistRemove }}
      v-col
        diet-table-filters(v-model="searchString")

    v-row
      v-col
        diet-table(
          v-model="tableSelection"
          :search-string="searchString"
          :items="tableItems"
          :selectable="isInRemoveMode"
          :single-select="!isInRemoveMode"
          with-amount
          without-serving
          @select="onDiaryTableSelect($event)"
          @item:change="onDiaryTableItemChange($event)"
        )

    v-row
      v-col
        v-textarea(
          v-model="diaryItem.summary"
          :label="$t('health.views.diary.summary')"
          name="summary"
        )

    select-modal(
      v-model="isSelectModalOpen"
      :items="dietItems"
      :selected-items="selectModalSelection"
      @cancel="onSelectModalCancel()"
      @confirm="onSelectModalConfirm($event)"
    )

    v-speed-dial(
      v-if="$vuetify.breakpoint.xs"
      v-model="isFabActive"
      bottom
      right
      fixed
    )
      template(v-slot:activator)
        v-btn.diary__fab(
          v-model="isFabActive"
          color="primary"
          fab
          large
        )
          v-icon(v-if="isFabActive") {{ $theme.icons.mdiClose}}
          v-icon(v-else) {{ $theme.icons.mdiDotsVertical }}
      v-btn(
        color="green lighten-2"
        fab
        dark
        @click="saveItem()"
      )
        v-icon {{ $theme.icons.mdiCheck }}
      v-btn.diary__fab__open-select-modal(
        color="teal lighten-2"
        fab
        dark
        @click="openSelectModal()"
      )
        v-icon {{ $theme.icons.mdiPlus }}
      v-btn(
        color="red lighten-2"
        fab
        dark
        @click="onRemoveClick()"
      )
        v-icon {{ $theme.icons.mdiPlaylistRemove }}
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import FormDatePicker from '../../../core/components/FormDatePicker';
import DietTable from '../../components/DietTable';
import DietTableFilters from '../../components/DietTableFilters';
import NutrientsChart from '../../components/NutrientsChart';
import SelectModal from '../../components/SelectModal';

export default {
  components: {
    DietTable,
    DietTableFilters,
    FormDatePicker,
    NutrientsChart,
    SelectModal,
  },
  data () {
    return {
      searchString: '',
      isFabActive: false,
      isSelectModalOpen: false,
      selectModalSelection: [],
      isInRemoveMode: false,
      tableSelection: [],
    };
  },
  computed: {
    ...mapState('core', [ 'loading' ]),
    ...mapState('health', {
      diaryItem: state => state.diary.item,
    }),
    ...mapGetters('health', {
      dietItems: 'diet/items',
    }),

    dateString: {
      get () {
        return this.$route.params.dateString;
      },
      set (dateString) {
        if (dateString !== this.$route.params.dateString) {
          this.$router.push({ name: 'health.diary.date', params: { dateString } });
        }
      },
    },
    tableItems () {
      const { items } = this.diaryItem || {};
      return items || [];
    },
    nutrientSummary () {
      return this.diaryItem ? this.diaryItem.getNutrients() : null;
    },
  },
  methods: {
    onDiaryTableSelect (item) {
      if (!this.isInRemoveMode) {
        this.$router.push({ name: 'health.diet', query: { 'selected': item.id } });
      }
    },
    onDiaryTableItemChange (item) {
      this.$store.dispatch('health/diary/updateItem', item);
    },
    openSelectModal () {
      this.selectModalSelection = [...this.tableItems];
      this.isSelectModalOpen = true;
    },
    onSelectModalCancel () {
      this.isSelectModalOpen = false;
    },
    onSelectModalConfirm (items) {
      this.$store.dispatch('health/diary/updateItem', { items });
      this.isSelectModalOpen = false;
    },
    onRemoveClick () {
      this.isInRemoveMode = !this.isInRemoveMode;
      if (!this.isInRemoveMode) {
        const removeIds = this.tableSelection.map(item => item.id);
        const items = this.diaryItem.items.filter(item => removeIds.indexOf(item.id) === -1);
        this.$store.dispatch('health/diary/updateItem', { items });
        this.tableSelection = [];
      }
    },

    async saveItem () {
      try {
        await this.$store.dispatch('health/diary/saveItem', this.diaryItem);
        this.$store.dispatch('core/notify/success', this.$t('health.views.diary.notifications.saved'));
      } catch ({ error }) {
        this.$store.dispatch('core/notify/error', this.$t('health.views.diary.notifications.unknownError'));
        throw error;
      }
    },
  },
  watch: {
    async '$route.params.dateString' (newDateString) {
      await this.$store.dispatch('health/diary/ensureItem', newDateString);
    },
  },
};
</script>

<style lang="sass">
.diary
  &__date-picker--narrow
    max-width: 8rem

</style>
