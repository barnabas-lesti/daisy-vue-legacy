<template lang="pug">
  v-list.sidebar-list(flat)
      sidebar-list-item(:item="dashboard")
      v-divider

      template(
        v-for="item in items"
      )
        sidebar-list-group(
          v-if="item.items"
          :key="item.label || item.labelKey"
          :group="item"
        )
        sidebar-list-item(
          v-else
          :key="item.label || item.labelKey"
          :item="item"
        )
      v-divider

      sidebar-list-item(:item="profile")

</template>

<script>
import { SidebarItem } from '../../models';
import SidebarListGroup from './SidebarListGroup.vue';
import SidebarListItem from './SidebarListItem.vue';

export default {
  components: {
    SidebarListGroup,
    SidebarListItem,
  },
  props: {
    items: Array,
  },
  data () {
    return {
      dashboard: new SidebarItem({
        labelKey: 'core.views.dashboard.title',
        icon: this.$icons.mdiViewDashboard,
        routeName: 'dashboard',
      }),
      profile: new SidebarItem({
        labelKey: 'core.views.profile.title',
        icon: this.$icons.mdiAccount,
        routeName: 'profile',
      }),
    };
  },
};
</script>
