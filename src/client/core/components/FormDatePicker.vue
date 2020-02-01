<template lang="pug">
  v-menu.form-date-picker(
    v-model="menu"
  )
    template(v-slot:activator="{ on }")
      v-text-field(
        v-model="_value"
        v-on="on"
        :label="label"
        readonly
      )
    v-date-picker(
      v-model="_value"
      ref="datePicker"
      no-title
      scrollable
    )
      v-spacer
      v-btn(
        color="primary"
        text
        @click="menu = false"
      ) {{ $t('core.components.formDatePicker.cancel') }}
      v-btn(
        color="primary"
        text
        @click="$datePicker.menu.save(_value)"
      ) {{ $t('core.components.formDatePicker.save') }}
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    _value: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
};
</script>
