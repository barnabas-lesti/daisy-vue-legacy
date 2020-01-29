<template lang="pug">
  .preferences.view
    h1 {{ $t('core.views.preferences.title') }}
    p.caption.font-italic {{ $t('core.views.preferences.description') }}

    v-simple-table
      tbody
        tr
          td {{ $t('core.views.preferences.table.darkTheme') }}
          td
            v-switch(
              v-model="isDarkTheme"
            )
</template>

<script>
export default {
  computed: {
    isDarkTheme: {
      get () { return this.$store.state.core.preferences.isDarkTheme; },
      set (newValue) { this.$store.commit('core/updatePreferences', { isDarkTheme: newValue }); },
    },
  },
};
</script>
