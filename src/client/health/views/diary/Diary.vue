<template lang="pug">
  .diary.view
    v-row
      v-col(
        :cols="$vuetify.breakpoint.xs ? 12 : 6"
        :offset="$vuetify.breakpoint.xs ? '': 6"
      )
        .diary__date-picker(:class="[ !$vuetify.breakpoint.xs ? 'diary__date-picker--narrow' : '' ]")
        form-date-picker(
          v-model="dateString"
          :label="$t('health.views.diary.datePicker')"
          :loading="loading"
        )

    v-row
      v-col
        nutrient-summary-chart.diary__summary(
          v-if="nutrientSummary"
          :summary="nutrientSummary"
        )

    v-row
      v-col(v-if="!$vuetify.breakpoint.xs")
        v-btn.mr-4.green.lighten-2.white--text(
          :disabled="loading"
          small
          fab
          @click="saveItem()"
        )
          v-icon {{ $theme.icons.mdiCheck }}
        v-btn.diary__open-select-modal.mr-4.teal.lighten-2.white--text(
          small
          fab
          @click="openSelectModal()"
        )
          v-icon {{ $theme.icons.mdiPlus }}
        v-btn.red.lighten-2.white--text(
          small
          fab
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

    template(v-if="diaryItem")
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

    food-modal(
      v-model="selectedItem && selectedItem.itemType === itemTypes.FOOD"
      :item="selectedItem"
      readonly
      @cancel="onDietModalCancel()"
    )

    recipe-modal(
      v-model="selectedItem && selectedItem.itemType === itemTypes.RECIPE"
      :item="selectedItem"
      readonly
      @cancel="onDietModalCancel()"
    )

    v-speed-dial(
      v-if="$vuetify.breakpoint.xs"
      v-model="isFabActive"
      bottom
      right
      fixed
    )
      template(v-slot:activator)
        v-btn.diary__fab.primary(
          v-model="isFabActive"
          fab
          large
        )
          v-icon(v-if="isFabActive") {{ $theme.icons.mdiClose}}
          v-icon(v-else) {{ $theme.icons.mdiDotsVertical }}
      v-btn.green.lighten-2.white--text(
        :disabled="loading"
        fab
        @click="saveItem()"
      )
        v-icon {{ $theme.icons.mdiCheck }}
      v-btn.diary__fab__open-select-modal.teal.lighten-2.white--text(
        fab
        @click="openSelectModal()"
      )
        v-icon {{ $theme.icons.mdiPlus }}
      v-btn.red.lighten-2.white--text(
        fab
        @click="onRemoveClick()"
      )
        v-icon {{ $theme.icons.mdiPlaylistRemove }}
</template>

<script>
import { mapGetters } from 'vuex';

import DietItem from '../../models/diet-item';
import FormDatePicker from '../../../core/components/FormDatePicker';
import DietTable from '../../components/DietTable';
import DietTableFilters from '../../components/DietTableFilters';
import NutrientSummaryChart from '../../components/NutrientSummaryChart';
import SelectModal from '../../components/SelectModal';
import FoodModal from '../../components/FoodModal';
import RecipeModal from '../../components/RecipeModal';

export default {
  components: {
    DietTable,
    DietTableFilters,
    FormDatePicker,
    NutrientSummaryChart,
    SelectModal,
    FoodModal,
    RecipeModal,
  },
  data () {
    return {
      itemTypes: DietItem.itemTypes,
      searchString: '',
      isFabActive: false,
      isSelectModalOpen: false,
      selectModalSelection: [],
      isInRemoveMode: false,
      tableSelection: [],
      diaryItemCache: null,
    };
  },
  computed: {
    ...mapGetters('core', [ 'loading' ]),
    ...mapGetters('health', {
      dietItems: 'diet/items',
    }),

    dateString: {
      get () {
        return this.$route.params.dateString;
      },
      set (newDateString) {
        if (newDateString !== this.$route.params.dateString) {
          this.diaryItemCache = this.diaryItem;
          this.$router.push({ name: 'health.diary.date', params: { dateString: newDateString } });
        }
      },
    },
    diaryItem () {
      return this.$store.state.health.diary.items.filter(item => item.dateString === this.dateString)[0] || this.diaryItemCache;
    },
    nutrientSummary () {
      return this.diaryItem && this.diaryItem.getNutrients();
    },
    selectedItem: {
      get () {
        const selected = this.$route.query['selected'];
        const item = this.tableItems.filter(item => item.id === selected)[0];
        if (item) {
          return item;
        } else {
          this.$router.clearQuery('selected');
          return null;
        }
      },
      set (newValue) {
        if (newValue) {
          this.$router.pushQuery({ 'selected': newValue.id });
        } else {
          this.$router.clearQuery('selected');
        }
      },
    },
    tableItems () {
      return this.diaryItem && this.diaryItem.items;
    },
  },
  methods: {
    onDietModalCancel () {
      this.selectedItem = null;
    },
    onDiaryTableSelect (item) {
      if (!this.isInRemoveMode) {
        this.selectedItem = item;
      }
    },
    onDiaryTableItemChange (item) {
      const updatedItems = this.diaryItem.items.filter(subject => subject.id !== item.id);
      updatedItems.push(item);
      this.$store.dispatch('health/diary/updateLocalItem', { dateString: this.dateString, items: [ ...updatedItems ] } );
    },
    openSelectModal () {
      this.selectModalSelection = [...this.tableItems];
      this.isSelectModalOpen = true;
    },
    onSelectModalCancel () {
      this.isSelectModalOpen = false;
    },
    onSelectModalConfirm (items) {
      this.$store.dispatch('health/diary/updateLocalItem', { items, dateString: this.dateString });
      this.isSelectModalOpen = false;
    },
    onRemoveClick () {
      this.isInRemoveMode = !this.isInRemoveMode;
      if (!this.isInRemoveMode) {
        const removeIds = this.tableSelection.map(item => item.id);
        const items = this.diaryItem.items.filter(item => removeIds.indexOf(item.id) === -1);
        this.$store.dispatch('health/diary/updateLocalItem', { items, dateString: this.dateString });
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
  created () {
    this.diaryItemCache = this.diaryItem;
  },
  watch: {
    async '$route.params.dateString' (newDateString) {
      await this.$store.dispatch('health/diary/ensureItems', [ newDateString ]);
    },
  },
};
</script>

<style lang="sass">
.diary
  &__date-picker--narrow
    max-width: 8rem

</style>
