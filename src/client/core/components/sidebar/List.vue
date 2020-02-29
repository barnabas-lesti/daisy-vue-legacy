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
import SidebarItem from '../../models/sidebar-item';
import ListGroup from './ListGroup.vue';
import ListItem from './ListItem.vue';

export default {
  components: {
    ListGroup,
    ListItem,
  },
  props: {
    items: Array,
  },
  data () {
    return {
      dashboard: new SidebarItem({
        labelKey: 'core.views.dashboard.title',
        icon: this.$theme.icons.mdiViewDashboard,
        routeName: 'dashboard',
      }),
      profile: new SidebarItem({
        labelKey: 'core.views.profile.title',
        icon: this.$theme.icons.mdiAccount,
        routeName: 'profile',
      }),
    };
  },
};
</script>
