<template lang="pug">
  .wallet.view
    v-row
      v-col
        h1 {{ $t('wallet.views.wallet.title') }}

    v-row
      v-col
        v-simple-table
          tbody
            tr(
              v-for="item in items"
              :key="item.id"
            )
              td
                router-link(:to="{ name: 'walletItem', params: { id: item.id } }") {{ item.name }}
              td.text-right {{ item.value }}
              td {{ item.currency }}

</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    isLoading: false,
  }),

  computed: {
    ...mapState('wallet', [ 'items' ]),
  },

  async created () {
    this.isLoading = true;
    await this.$store.dispatch('wallet/fetchItems');

    this.isLoading = false;
  },
};
</script>
