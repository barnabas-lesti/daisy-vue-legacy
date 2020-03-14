<template lang="pug">
  v-list.layout-sidebar-list(flat)
      layout-sidebar-list-item(:item="dashboard")
      v-divider
      template(
        v-for="item in items"
      )
        layout-sidebar-list-group(
          v-if="item.items"
          :key="item.label || item.labelKey"
          :group="item"
          :active-route="activeRoute"
        )
        layout-sidebar-list-item(
          v-else
          :key="item.label || item.labelKey"
          :item="item"
        )
      v-divider
      layout-sidebar-list-item(:item="profile")
</template>

<script>
import LayoutSidebarListGroup from './LayoutSidebarListGroup';
import LayoutSidebarListItem from './LayoutSidebarListItem';

export default {
  components: {
    LayoutSidebarListGroup,
    LayoutSidebarListItem,
  },
  props: {
    items: Array,
    activeRoute: String,
  },
  data () {
    return {
      dashboard: {
        labelKey: 'views.dashboard.title',
        icon: this.$theme.icons.mdiViewDashboard,
        routeName: 'dashboard',
      },
      profile: {
        labelKey: 'views.profile.title',
        icon: this.$theme.icons.mdiAccount,
        routeName: 'profile',
      },
    };
  },
};
</script>
