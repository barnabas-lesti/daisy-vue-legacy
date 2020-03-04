class Widget {
  constructor ({ id, group, Component }) {
    this.id = id;
    this.group = group;
    this.Component = Component;
  }
}

class WidgetRepo {
  constructor () {
    this._widgets = [];
  }

  /**
   * @param {String} groupKey
   * @returns {Widget[]}
   */
  getWidgets () {
    return this._widgets;
  }

  getWidgetGroups () {
    const groups = {};
    for (let i = 0; i < this._widgets.length; i++) {
      const widget = this._widgets[i];
      if (!groups[widget.group]) groups[widget.group] = [];
      groups[widget.group].push(widget);
    }
    return groups;
  }

  getWidgetComponentObjects () {
    const object = {};
    for (let i = 0; i < this._widgets.length; i++) {
      const widget = this._widgets[i];
      object[widget.Component.name] = widget.Component;
    }
    return object;
  }

  /**
   * @param {Widget[]} widgets
   */
  addWidgets (widgets) {
    this._widgets.push(...widgets.map(widget => new Widget(widget)));
  }
}

export default new WidgetRepo();
