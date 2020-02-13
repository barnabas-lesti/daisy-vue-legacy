<template lang="pug">
  .profile.view
    v-row
      v-col
        h1 {{ $t('core.views.profile.title') }}

    v-row
      v-col
        v-form(
          ref="form"
          @submit.prevent="submit()"
        )
          v-text-field(
            v-model="user.fullName"
            :label="$t('core.views.profile.labels.fullName')"
            name="fullName"
          )

</template>

<script>
import { User } from '../models';

export default {
  data () {
    return {
      user: new User(),
    };
  },
};
</script>
