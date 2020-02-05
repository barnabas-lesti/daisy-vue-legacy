<template lang="pug">
  .wallet-item.view
    v-row
      v-col
        h1 {{ $t('wallet.views.walletItem.title') }}

    v-row
      v-col
        v-form(@submit.prevent="saveItem()")
          v-text-field(
            v-model="item.name"
            :label="$t('wallet.views.walletItem.form.labels.name')"
            :readonly="form.isLoading"
          )
          v-text-field(
            v-model="item.value"
            :label="$t('wallet.views.walletItem.form.labels.value')"
            :readonly="form.isLoading"
            type="number"
          )
          v-select(
            v-model="item.currency"
            :label="$t('wallet.views.walletItem.form.labels.currency')"
            :items="form.settings.currencies"
            :readonly="form.isLoading"
          )
          v-select(
            v-model="item.itemType"
            :label="$t('wallet.views.walletItem.form.labels.itemType')"
            :items="form.settings.itemTypes"
            :readonly="form.isLoading"
          )
          v-select(
            v-model="item.paymentType"
            :label="$t('wallet.views.walletItem.form.labels.paymentType')"
            :items="form.settings.paymentTypes"
            :readonly="form.isLoading"
          )
          form-date-picker(
            v-model="transactionDate"
            :label="$t('wallet.views.walletItem.form.labels.transactionDate')"
            :readonly="form.isLoading"
          )
          v-select(
            v-model="item.category"
            :label="$t('wallet.views.walletItem.form.labels.category')"
            :items="form.settings.categories"
            :readonly="form.isLoading"
          )

          v-btn(
            :readonly="form.isLoading"
            :loading="form.isLoading"
            color="primary"
            type="submit"
          ) {{ $t('wallet.views.walletItem.form.labels.submit') }}

    pre {{ item }}
</template>

<script>
import { mapState } from 'vuex';

import { categories, currencies, itemTypes, paymentTypes } from '../constants';

import { FormDatePicker } from '../../core/components';

export default {
  components: {
    FormDatePicker,
  },

  data () {
    return {
      form: {
        isLoading: true,
        settings: {
          categories: categories.map(item => ({ text: this.$t(`wallet.common.categories.${item}`), value: item })),
          currencies: currencies.map(item => ({ text: this.$t(`wallet.common.currencies.${item}`), value: item })),
          itemTypes: itemTypes.map(item => ({ text: this.$t(`wallet.common.itemTypes.${item}`), value: item })),
          paymentTypes: paymentTypes.map(item => ({ text: this.$t(`wallet.common.paymentTypes.${item}`), value: item })),
        },
      },
    };
  },

  computed: {
    ...mapState('wallet', [ 'item' ]),

    transactionDate: {
      get () { return this.item.getFormattedTransactionDate(); },
      set (newValue) { this.item.setFormattedTransactionDate(newValue); },
    },
  },

  methods: {
    async saveItem () {
      this.form.isLoading = true;
      await this.$store.dispatch('wallet/saveItem', this.item);
      this.form.isLoading = false;
    },
  },

  async created () {
    const { id } = this.$route.params;
    if (id) await this.$store.dispatch('wallet/fetchItem', id);

    this.form.isLoading = false;
  },
};
</script>
