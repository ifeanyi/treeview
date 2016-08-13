'use strict';

class Node {
  constructor(data = {}) {
    const { id = '', text = '' } = data;
    this.id = id;
    this.text = text;
    this.checkedState = -1;
    this.expanded = false;
    this.parentId = null;
    this.childIds = [];
    this.path = '';
    this.depth = 0;
    this.index = 0;
    this.data = data;
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
    childNode.index = parentNode.childIds.size;

    return childNode;
  }

  // static create(data, ...rest) {
  // static create(data, parentNode = null, mapper = parentNode) {
  static create(data, { mapper = null, parentNode = null} = {}) {

    return parentNode ? Node.createFromParent(parentNode, data, mapper) :
      Node.createFromData(data, mapper);
  }

  static isParent(node) {
    return Boolean(node.childIds.length);
  }

  static isSelectable(node) {
    return node.checkState >= 0;
  }
}

export const NodeCheckedStates = {
  none: -1,
  unchecked: 0,
  intermediate: 1,
  checked: 2
};

export default Node;
