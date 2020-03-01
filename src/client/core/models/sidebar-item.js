export default class SidebarItem {
  /**
   * @param {SidebarItem} args
   */
  constructor ({ icon, items, label, labelKey, order, routeName }) {
    this.icon = icon;
    this.items = items;
    this.label = label;
    this.labelKey = labelKey;
    this.order = order || 0;
    this.routeName = routeName;
  }
}
