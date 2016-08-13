import Node from './Node';
import isArray from 'lodash.isarray';

export default function * (data, { mapper = null, parentNode = null} = {}) {
  const stack = [];
  const visited =  new Set();

  stack.unshift(Node.create(data, { mapper, parentNode }));
  while(stack.length) {
    const node = stack.shift();

    if(visited.has(node.id)) {
      continue;
    }

    visited.add(node.id);
    yield(node);

    if(node.data.children && (isArray(node.data.children) && node.data.children.length)) {
      const childNodeList = node.data.children.map((childDataNode) => {
        const childNode = Node.create(childDataNode, { mapper, parentNode: node });

        node.childIds.push(childNode.id);
        return childNode;
      });
      Array.prototype.unshift.apply(stack, childNodeList);
    }
  }

  return visited.size;
}
