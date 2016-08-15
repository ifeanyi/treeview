import Node from '../Node';
import assert from 'power-assert';

const data = {
  id: 'n0',
  text: 'n0',
  showCheckbox: false,
  children: [],
  data: {
    resourceId: '2322323'
  }
};

describe('Node', function() {
  it('Initializes', function() {
    const node = new Node();
    assert(node);
  });

  it('Really clones', function() {
    const state = new Node(data);
    const nextState = state.clone();

    assert(state !== nextState);
    assert(nextState instanceof Node);
    assert.deepStrictEqual(state, nextState);
  });

  it('Set is Immutable', function() {
    const state = new Node(data);
    const nextState = state.set({ expanded: true });

    assert(state !== nextState);
    assert(nextState instanceof Node);
    assert(nextState.expanded, true);
    assert.notDeepStrictEqual(state, nextState);
  });
});
