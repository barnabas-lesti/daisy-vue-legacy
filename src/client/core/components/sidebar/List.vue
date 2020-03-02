<template lang="pug">
  v-list.list(flat)
      list-item(:item="dashboard")
      v-divider
      template(
        v-for="item in items"
      )
        list-group(
          v-if="item.items"
          :key="item.label || item.labelKey"
          :group="item"
          :active-route="activeRoute"
        )
        list-item(
          v-else
          :key="item.label || item.labelKey"
          :item="item"
        )
      v-divider
      list-item(:item="profile")
</template>

<script>
import ListGroup from './ListGroup.vue';
import ListItem from './ListItem.vue';

export default {
  components: {
    ListGroup,
    ListItem,
  },
  props: {
    items: Array,
    activeRoute: String,
  },
  data () {
    return {
      dashboard: {
        labelKey: 'core.views.dashboard.title',
        icon: this.$theme.icons.mdiViewDashboard,
        routeName: 'dashboard',
      },
      profile: {
        labelKey: 'core.views.profile.title',
        icon: this.$theme.icons.mdiAccount,
        routeName: 'profile',
      },
    };
  },
};
</script>
