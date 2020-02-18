export default class SidebarItem {
  /**
   * @param {SidebarItem} args
   */
  constructor ({ icon, items, label, labelKey, order, routeName }) {
    /**
     * @type {String}
     */
    this.icon = icon;

    /**
     * @type {SidebarItem[]}
     */
    this.items = items;

    /**
     * @type {String}
     */
    this.label = label;

    /**
     * @type {String}
     */
    this.labelKey = labelKey;

    /**
     * @type {Number}
     */
    this.order = order || 0;

    /**
     * @type {String}
     */
    this.routeName = routeName;
  }
}
