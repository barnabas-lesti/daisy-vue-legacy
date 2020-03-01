<template lang="pug">
  v-dialog.modal(
    v-model="isOpen"
    :fullscreen="$vuetify.breakpoint.xs"
    :hide-overlay="$vuetify.breakpoint.xs"
    :transition="$vuetify.breakpoint.xs ? 'dialog-bottom-transition' : ''"
    :scrollable="!$vuetify.breakpoint.xs"
    max-width="40rem"
  )
    v-card.modal__content(
      :class="contentClass"
      tile
    )
      v-toolbar.modal__toolbar.white--text(
        v-if="$vuetify.breakpoint.xs"
        :color="headerColor || 'primary'"
      )
        v-toolbar-title {{ title }}
        v-spacer
        v-toolbar-items
          v-btn.modal__toolbar__confirm.white--text(
            v-if="!readonly"
            :loading="loading"
            icon
            @click="confirm()"
          )
            v-icon {{ $theme.icons.mdiCheck }}
          v-btn.modal__toolbar__remove.white--text(
            v-if="!readonly && withRemove"
            icon
            @click="remove()"
          )
            v-icon {{ $theme.icons.mdiDelete }}
          v-btn.modal__toolbar__cancel.white--text(
            icon
            @click="cancel()"
          )
            v-icon {{ $theme.icons.mdiClose }}
      v-card-title.pa-4(v-if="!$vuetify.breakpoint.xs") {{ title }}
      v-divider
      v-card-text.modal__slot(
        :class="[ $vuetify.breakpoint.xs ? 'modal__slot--mobile' : '' ]"
      )
        slot
      template(v-if="!$vuetify.breakpoint.xs")
        v-divider
        v-card-actions.pa-4
          v-spacer
          v-btn.modal__cancel.ma-0(
            tile
            @click="cancel()"
          ) {{ $t('core.components.modal.cancel') }}
          v-btn.modal__remove.ma-0.ml-4.red.lighten-2.white--text(
            v-if="!readonly && withRemove"
            tile
            @click="remove()"
          ) {{ $t('core.components.modal.remove') }}
          v-btn.modal__confirm.ma-0.ml-4.primary(
            v-if="!readonly"
            :loading="loading"
            tile
            @click="confirm()"
          ) {{ $t('core.components.modal.confirm') }}

    v-dialog(
      v-model="confirmRemoveDialog"
      max-width="16rem"
    )
      v-card.modal__confirm-remove(tile)
        v-card-text.pt-4 {{ $t('core.components.modal.removeWarning') }}
        v-card-actions
          v-spacer
          v-btn.modal__confirm-remove__cancel(
            tile
            text
            autofocus
            @click="confirmRemoveDialog = false;"
          ) {{ $t('core.components.modal.cancel') }}
          v-btn.modal__confirm-remove__confirm.primary(
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
    contentClass: String,
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
      if (this.isOpen && !this.loading) this.$emit('cancel');
    },
    confirm () {
      if (!this.loading) this.$emit('confirm');
    },
    remove () {
      if (!this.loading) this.confirmRemoveDialog = true;
    },
    edit (route) {
      route.query = route.query || {};
      route.query['referer'] = this.$route.fullPath;
      this.$router.push(route);
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
  &__slot--mobile
    padding: 16px 16px 64px 16px !important
</style>
