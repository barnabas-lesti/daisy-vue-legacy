<template lang="pug">
  v-menu.form-date-picker(
    v-model="menu"
    :disabled="disabled || loading"
    min-width="0"
  )
    template(v-slot:activator="{ on }")
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
        color="primary"
        text
        tile
        @click="menu = false"
      ) {{ $t('core.components.formDatePicker.cancel') }}
      v-btn(
        color="primary"
        text
        tile
        @click="$datePicker.menu.save(_value)"
      ) {{ $t('core.components.formDatePicker.save') }}
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
