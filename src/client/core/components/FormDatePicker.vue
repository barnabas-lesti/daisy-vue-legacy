<template lang="pug">
  v-menu.form-date-picker(
    v-model="menu"
    :disabled="disabled || loading"
    min-width="0"
  )
    template(v-slot:activator="{ on }")
      label.form-date-picker__wrapper
        v-text-field.form-date-picker__text-field(
          v-show="!onlyIcon"
          v-model="localValue"
          v-on="on"
          :loading="loading"
          :label="label"
          :disabled="disabled || loading"
          :solo="solo"
          :append-icon="!solo && appendIcon ? $theme.icons.mdiCalendar : ''"
          :prepend-icon="!solo && !appendIcon ? $theme.icons.mdiCalendar : ''"
          :append-inner-icon="solo && appendIcon ? $theme.icons.mdiCalendar : ''"
          :prepend-inner-icon="solo && !appendIcon ? $theme.icons.mdiCalendar : ''"
          readonly
          hide-details
        )
        v-btn(
          v-show="onlyIcon"
          :loading="loading"
          icon
          small
          @click="menu = true"
        )
          v-icon {{ $theme.icons.mdiCalendar }}
    v-date-picker(
      v-model="localValue"
      :first-day-of-week="1"
      no-title
      offset-y
    )
      v-spacer
      v-btn(
        text
        tile
        @click="menu = false;"
      ) {{ $t('core.components.formDatePicker.cancel') }}
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    disabled: Boolean,
    loading: Boolean,
    appendIcon: Boolean,
    onlyIcon: Boolean,
    solo: Boolean,
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    localValue: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
};
</script>

<style lang="sass">
.form-date-picker
  &__wrapper
    width: 100%

  &__text-field
    border-radius: 0
</style>
