import assign from 'lodash.assign';
import treeWalk from './treeWalk';
import Node from './Node';

// const ZERO = 0;
// const ONE = 1;
// const INDEX_NOT_FOUND = -1;

const MutableStates = {
  mutable: 0,
  immutable: 1
};

/**
  Construct a new component

  @class TreeViewState
  @classdesc

  @param {Object} options - Options to initialize the component with
  @param {String} options.name - This component's name, sets {@link Component#name}
  @param {Boolean} options.visible - Whether this component is vislble, sets {@link Component#visible}
*/
export class TreeViewState {
  static createFromData(data, options) {
    return new TreeViewState(options, data);
  }

  static createFromInstance(treeViewState) {
    return treeViewState.clone();
  }

  constructor(options, data = null) {
    this._nodes = {};
    this._roots = [];
    this._count = 0;
    this._options = assign({}, {
      mapper: null
    }, options);
    this._mutableState = MutableStates.immutable;

    if (data) {
      this._add(data);
    }
  }

  clone() {
    if (this._mutableState === MutableStates.mutable) {
      return this;
    }

    const that = new TreeViewState(this._options);
    that._nodes = assign({}, this._nodes);
    that._roots = this._roots.slice();
    that._count = this._count;

    return that;
  }

  get(nodeId) {
    return this._nodes[nodeId] || null;
  }

  get size() {
    return this._count;
  }

  get root() {
    return this._roots.map(id => this.get(id));
  }

  _add(data, parentId = null) {
    const parentIdWasDefined = parentId !== null;
    const parentNode = parentIdWasDefined ? this.get(parentId) : null;
    const parentNodeWasNotFound = parentIdWasDefined && !parentNode;
    let added = 0;

    if (parentNodeWasNotFound) {
      throw 'Node not found!'; //todo maybe allow floating nodes
    }

    for (let node of treeWalk(data, { parentNode })) {
      // if this node isn't gonna be attached anywhere
      if (!parentIdWasDefined && !node.parentId) {
        this._roots.push(node.id);
      }

      this._nodes[node.id] =  node;
      added += 1;
    }

    this._count += added;
  }

  _remove(nodeId) {

  }

  asMutable() {
    this._mutableState = MutableStates.mutable;
    return this;
  }

  asImmutable() {
    this._mutableState = MutableStates.immutable;
    return this;
  }

  withMutations(fn) {
    // needed for withMutations nesting
    if (this._mutableState === MutableStates.mutable) {
      fn(this);
      return this;
    }

    const tvs = this.clone().asMutable();

    fn(tvs);
    return tvs.asImmutable();
  }

  /* traverse city */
  * parents(ref) {
    let node;

    if (ref instanceof Node) {
      node = this.get(ref.parentId);
    } else {
      node = this.get(ref);
    }

    while(node) {
      yield node;
      node = this.get(node.parentId);
    }
  }

  * children(...nodeIds) {
    const startNodes = nodeIds.map(id => this.get(id)).filter(node => !!node);
    const discovered = new Set();

    for (let startNode of startNodes) {
      const stack = [...startNode.childIds];

      while(stack.length) {
        const id =  stack.shift();

        if(discovered.has(id)) {
          continue;
        } else {
          discovered.add(id);
        }

        const node = this.get(id);
        if (node) {
          yield node;
          Array.prototype.unshift.apply(stack, node.childIds);
        }
      }
    }
  }

  * [Symbol.iterator]() {
    for (let node of this.root) {
      yield node;
      yield * this.children(node.id);
    }
  }
}


export default TreeViewState;
