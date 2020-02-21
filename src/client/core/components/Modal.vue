<template lang="pug">
  v-dialog.modal(
    v-model="isOpen"
    :fullscreen="$vuetify.breakpoint.xs"
    :hide-overlay="$vuetify.breakpoint.xs"
    :transition="$vuetify.breakpoint.xs ? 'dialog-bottom-transition' : ''"
    :scrollable="!$vuetify.breakpoint.xs"
    max-width="40rem"
    data-qa="modal"
  )
    v-card(tile)
      v-toolbar.modal__toolbar(
        v-if="$vuetify.breakpoint.xs"
        :color="headerColor || 'primary'"
        dark
      )
        v-toolbar-title {{ title }}
        v-spacer
        v-toolbar-items
          v-btn(
            v-if="!readonly"
            :loading="loading"
            data-qa="modal.mobile.confirm"
            icon
            dark
            @click="confirm()"
          )
            v-icon {{ $theme.icons.mdiCheck }}
          v-btn(
            v-if="!readonly && withRemove"
            data-qa="modal.mobile.remove"
            icon
            dark
            @click="remove()"
          )
            v-icon {{ $theme.icons.mdiDelete }}
          v-btn(
            data-qa="modal.mobile.cancel"
            icon
            dark
            @click="cancel()"
          )
            v-icon {{ $theme.icons.mdiClose }}
      v-card-title.pa-4(v-if="!$vuetify.breakpoint.xs") {{ title }}
      v-divider
      v-card-text.pa-4(data-qa="modal.content")
        slot
      template(v-if="!$vuetify.breakpoint.xs")
        v-divider
        v-card-actions.pa-4
          v-spacer
          v-btn(
            data-qa="modal.desktop.cancel"
            text
            tile
            @click="cancel()"
          ) {{ $t('core.components.modal.cancel') }}
          v-btn(
            v-if="!readonly && withRemove"
            color="red lighten-2"
            data-qa="modal.desktop.remove"
            dark
            tile
            @click="remove()"
          ) {{ $t('core.components.modal.remove') }}
          v-btn(
            v-if="!readonly"
            :loading="loading"
            color="primary"
            data-qa="modal.desktop.confirm"
            tile
            @click="confirm()"
          ) {{ $t('core.components.modal.confirm') }}

    v-dialog(
      v-if="!readonly"
      v-model="confirmRemoveDialog"
      max-width="16rem"
    )
      v-card(tile)
        v-card-text.pt-4 {{ $t('core.components.modal.removeWarning') }}
        v-card-actions
          v-spacer
          v-btn(
            data-qa="modal.remove.cancel"
            tile
            text
            @click="confirmRemoveDialog = false;"
          ) {{ $t('core.components.modal.cancel') }}
          v-btn(
            color="primary"
            data-qa="modal.remove.confirm"
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
    headerColor: String,
    readonly: Boolean,
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
    cancel () {
      if (!this.loading) this.$emit('cancel');
    },
    confirm () {
      if (!this.readonly && !this.loading) this.$emit('confirm');
    },
    remove () {
      if (!this.readonly && !this.loading) this.confirmRemoveDialog = true;
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
