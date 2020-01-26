<template lang="pug">
  .preferences.view
    h1 {{ $t('core.preferences.title') }}
    p.caption.font-italic {{ $t('core.preferences.description') }}

    v-simple-table
      tbody
        tr
          td {{ $t('core.preferences.table.darkTheme') }}
          td
            v-switch(
              v-model="isDarkTheme"
            )
</template>

<script>
export default {
  data: () => ({
    switch1: true,
  }),

  computed: {
    isDarkTheme: {
      get () { return this.$store.state.core.preferences.isDarkTheme; },
      set (newValue) { this.$store.commit('core/updatePreferences', { isDarkTheme: newValue }); },
    },
  },
};
</script>
