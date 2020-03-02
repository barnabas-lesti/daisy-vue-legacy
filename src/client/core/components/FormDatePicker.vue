<template lang="pug">
  v-menu.form-date-picker(
    v-model="menu"
    :disabled="disabled || loading"
    min-width="0"
  )
    template(v-slot:activator="{ on }")
      label.form-date-picker__wrapper
        v-text-field(
          v-model="localValue"
          v-on="on"
          :label="label"
          :disabled="disabled || loading"
          :append-icon="appendIcon ? $theme.icons.mdiCalendar : ''"
          :prepend-icon="!appendIcon ? $theme.icons.mdiCalendar : ''"
          readonly
          hide-details
        )
    v-date-picker(
      v-model="localValue"
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
</style>
