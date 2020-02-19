<template lang="pug">
  v-dialog.modal(
    v-model="isOpen"
    :fullscreen="$vuetify.breakpoint.xs"
    :hide-overlay="$vuetify.breakpoint.xs"
    :transition="$vuetify.breakpoint.xs ? 'dialog-bottom-transition' : ''"
    max-width="40rem"
  )
    v-card.pa-sm-4(tile)
      v-toolbar.modal__toolbar(
        v-if="$vuetify.breakpoint.xs"
        color="primary"
        dark
      )
        v-toolbar-title {{ title }}
        v-spacer
        v-toolbar-items
          v-btn(
            :loading="loading"
            icon
            dark
            @click="confirm()"
          )
            v-icon {{ $icons.mdiCheck }}
          v-btn(
            v-if="withRemove"
            icon
            dark
            @click="remove()"
          )
            v-icon {{ $icons.mdiDelete }}
          v-btn(
            icon
            dark
            @click="cancel()"
          )
            v-icon {{ $icons.mdiClose }}
      v-card-title.pa-4.pb-0(v-if="!$vuetify.breakpoint.xs") {{ title }}
      v-card-text.pa-4
        slot
      v-card-actions(v-if="!$vuetify.breakpoint.xs")
        v-spacer
        v-btn(
          text
          tile
          @click="cancel()"
        ) {{ $t('core.components.modal.cancel') }}
        v-btn(
          v-if="withRemove"
          color="red lighten-2"
          dark
          tile
          @click="remove()"
        ) {{ $t('core.components.modal.remove') }}
        v-btn(
          :loading="loading"
          color="primary"
          tile
          
          @click="confirm()"
        ) {{ $t('core.components.modal.confirm') }}

    v-dialog(
      v-model="confirmRemoveDialog"
      max-width="16rem"
    )
      v-card(tile)
        v-card-text.pt-4 {{ $t('core.components.modal.removeWarning') }}
        v-card-actions
          v-spacer
          v-btn(
            tile
            text
            @click="confirmRemoveDialog = false;"
          ) {{ $t('core.components.modal.cancel') }}
          v-btn(
            color="primary"
            tile
            text
            @click="confirmRemove()"
          ) {{ $t('core.components.modal.confirm') }}
</template>

<script>
export default {
  props: {
    value: Boolean,
    title: String,
    loading: Boolean,
    withRemove: Boolean,
  },
  data () {
    return {
      confirmRemoveDialog: false,
    };
  },
  computed: {
    isOpen: {
      get () { return this.value; },
      set (newValue) {
        if (newValue) this.confirm();
        else this.cancel();
      },
    },
  },
  methods: {
    confirm () {
      if (!this.loading) this.$emit('confirm');
    },
    cancel () {
      if (!this.loading) this.$emit('cancel');
    },
    remove () {
      if (!this.loading) this.confirmRemoveDialog = true;
    },
    confirmRemove () {
      this.confirmRemoveDialog = false;
      this.$emit('remove');
    },
  },
};
</script>

<style lang="sass">
.modal
  &__toolbar
    .v-toolbar__content
      padding-right: .25rem
</style>
