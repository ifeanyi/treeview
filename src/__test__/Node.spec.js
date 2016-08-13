import Node from '../Node';
import assert from 'power-assert';
import assign from 'lodash.assign';

describe('Node', function() {
  it('Initializes', function() {
    const node = new Node();
    assert(node);
  });

  it('It clones', function() {
    const node = new Node();
    node.id = '1';

    const node2 = assign({}, node);
    assert.equal(node2.id, node.id);

    assert.equal(
      Object.keys(node).join('_'),
      Object.keys(node2).join('_')
    );
  });
});
