<template lang="pug">
  .wallet-item.view
    h1 {{ $t('wallet.views.walletItem.title') }}

    v-form
      v-text-field(
        v-model="form.model.name"
        :label="$t('wallet.views.walletItem.form.labels.name')"
      )
      v-text-field(
        v-model="form.model.value"
        :label="$t('wallet.views.walletItem.form.labels.value')"
        type="number"
      )
      v-select(
        v-model="form.model.currency"
        :label="$t('wallet.views.walletItem.form.labels.currency')"
        :items="form.settings.currencies"
      )
      v-select(
        v-model="form.model.itemType"
        :label="$t('wallet.views.walletItem.form.labels.itemType')"
        :items="form.settings.itemTypes"
      )
      v-select(
        v-model="form.model.paymentType"
        :label="$t('wallet.views.walletItem.form.labels.paymentType')"
        :items="form.settings.paymentTypes"
      )
      form-date-picker(
        v-model="transactionDate"
        :label="$t('wallet.views.walletItem.form.labels.transactionDate')"
      )
      v-select(
        v-model="form.model.category"
        :label="$t('wallet.views.walletItem.form.labels.category')"
        :items="form.settings.categories"
      )

      v-btn(
        color="primary"
      ) {{ $t('wallet.views.walletItem.form.labels.submit') }}

    pre {{ form.model }}
</template>

<script>
import WalletItem from '../models/wallet-item';
import { categories, currencies, itemTypes, paymentTypes } from '../constants';

import { FormDatePicker } from '../../core/components';

export default {
  components: {
    FormDatePicker,
  },

  data () {
    return {
      form: {
        datePickerMenu: false,
        model: new WalletItem(),
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
    transactionDate: {
      get () { return this.form.model.getFormattedTransactionDate(); },
      set (newValue) { this.form.model.setFormattedTransactionDate(newValue); },
    },
  },

  created () {
    const { itemId } = this.$route.params;
    if (itemId) {
      // TODO: Fetch from server
    } else {
      // TODO: check/set as a new empty item
    }
  },
};
</script>
