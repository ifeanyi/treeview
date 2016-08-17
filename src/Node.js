'use strict';

class Node {
  constructor(data = {}) {
    const { id = '', text = '' } = data;
    this.id = id;
    this.text = text;
    this.expanded = false;
    this.parentId = null;
    this.childIds = [];
    this.path = '';
    this.depth = 0;
    this.index = 0;
    this.data = data;
  }

  clone() {
    const next = new this.constructor();

    next.id = this.id;
    next.text = this.text;
    next.expanded = this.expanded;
    next.parentId = this.parentId;
    next.childIds = this.childIds.slice();
    next.path = this.path;
    next.depth = this.depth;
    next.index = this.index;
    next.data = this.data;

    return next;
  }

  set(props) {
    const next = this.clone();

    for (let key of Object.keys(props)) {
      next[key] = props[key];
    }

    return next;
  }

  expand() {
    return this.set({ expanded: true });
  }

  collapse() {
    return this.set({ expanded: false });
  }

  static createFromData(data, mapper) {
    const node = mapper ? new Node(mapper(data)) : new Node(data);

    return node;
  }

  static createFromParent(parentNode, data, mapper) {
    const childNode = Node.createFromData(data, mapper);

    childNode.parentId = parentNode.id;
    childNode.path = parentNode.path + '/' + parentNode.id;
    childNode.depth = parentNode.depth + 1;
    childNode.index = parentNode.childIds.length;

    return childNode;
  }

  static create(data, { mapper = null, parentNode = null} = {}) {

    return parentNode ? Node.createFromParent(parentNode, data, mapper) :
      Node.createFromData(data, mapper);
  }

  static isParent(node) {
    return Boolean(node.childIds.length);
  }
}

export default Node;
