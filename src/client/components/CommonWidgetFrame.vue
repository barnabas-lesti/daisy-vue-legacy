<template lang="pug">
  v-card.common-widget-frame
    v-card-title.d-block
      .title.pr-8 {{ title }}
      .caption {{ caption }}
      .common-widget-frame__date-picker
        common-form-date-picker(
          v-model="localValue"
          :loading="loading"
          only-icon
        )
    v-card-text
      slot
</template>

<script>
import CommonFormDatePicker from './CommonFormDatePicker';

export default {
  components: {
    CommonFormDatePicker,
  },
  props: {
    loading: Boolean,
    title: String,
    caption: String,
    value: String,
  },
  computed: {
    localValue: {
      get () { return this.dateString; },
      set (newDateString) { this.$emit('input', newDateString); },
    },
  },
};
</script>

<style lang="sass">
.common-widget-frame
  position: relative
  &__date-picker
    position: absolute
    top: 16px
    right: 16px
</style>
