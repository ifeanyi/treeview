import TreeViewState from '../TreeViewState';
import Node from '../Node';
import assert from 'power-assert';
import { simpleTreeData, simpleTreeDataOrder } from './fixtures';
import { spy } from 'sinon';

const createFromSimpleData = () => TreeViewState.createFromData(simpleTreeData);

describe('TreeViewState', function() {
  it('Initializes', function() {
    const tvs = new TreeViewState();
    assert.ok(tvs);
  });

  it('Initializes from data', function() {
    const tvs = TreeViewState.createFromData(simpleTreeData);
    assert.ok(tvs);
  });

  it('Clones', function() {
    const tvs = TreeViewState.createFromData(simpleTreeData);
    const tvs2 = tvs.clone();

    assert.notEqual(tvs, tvs2);
    assert.strictEqual(tvs.size, tvs2.size);
    assert.deepStrictEqual(tvs.root, tvs2.root);
  });
});

describe('TreeViewState: Accounting', function() {
  let tvs;

  before('Initialize it', function() {
    tvs = TreeViewState.createFromData(simpleTreeData);
  });

  it('Collects all nodes', function () {
    assert.strictEqual(tvs.size, 10);
  });

  it('Assigns root', function() {
    assert.strictEqual(tvs.root.map(node => node.id).join(','), 'n0');
  });

  it('Assigns depth', function() {
    assert.strictEqual(tvs.get('n0').depth, 0);
    assert.strictEqual(tvs.get('n00').depth, 1);
    assert.strictEqual(tvs.get('n000').depth, 2);
    assert.strictEqual(tvs.get('n0000').depth, 3);
  });

  it('Assigns path', function() {
    assert.ok(tvs.get('n00').path.includes('n0'));

    const n000path = tvs.get('n000').path;
    assert.ok(n000path.includes('n00'));
    assert.ok(n000path.includes('n0'));

    const n0000path = tvs.get('n0000').path;
    assert.ok(n0000path.includes('n000'));
    assert.ok(n0000path.includes('n00'));
    assert.ok(n0000path.includes('n00'));
  });

  it('Assigns parentIds', function() {
    assert.strictEqual(tvs.get('n0').parentId, null);
    assert.strictEqual(tvs.get('n00').parentId, tvs.get('n0').id);
    assert.strictEqual(tvs.get('n000').parentId, tvs.get('n00').id);
    assert.strictEqual(tvs.get('n0000').parentId, tvs.get('n000').id);
  });

  it('Retrieves node by id', function() {
    [ 'n000', 'n01', 'n0111' ].forEach(id => {
      assert.strictEqual(tvs.get(id).id, id);
    });

    assert.strictEqual(tvs.get('not'), null);
  });
});

describe('TreeViewState: Iteration', function() {
  let tvs;
  const n0111Ancestry = [ 'n011', 'n01', 'n0' ];

  before('Initialize it', function() {
    tvs = TreeViewState.createFromData(simpleTreeData);
  });

  it('Gets parents with node id', function() {
    let ancestryIndex = 0;

    for(let { id } of tvs.parents('n0111')) {
      assert.strictEqual(id, n0111Ancestry[ancestryIndex++]);
    }
  });

  it('Gets parents with node reference', function() {
    const n0111 = tvs.get('n0111');
    const result = [ ...tvs.parents(n0111) ].map(node => node.id);

    assert.deepStrictEqual(n0111Ancestry, result);
  });

  it('Children: n01', function() {
    const result = [ ...tvs.children('n01') ].map(node => node.id);

    assert.deepStrictEqual(simpleTreeDataOrder.slice(-5), result);
  });

  it('Children: n00, n01', function() {
    const ids = [ 'n00', 'n01' ];
    const result = [ ...tvs.children(...ids) ].map(node => node.id);
    const expected = [ 'n000', 'n0000', 'n010', 'n011', 'n0110', 'n0111', 'n012' ];

    assert.deepStrictEqual(result, expected);
  });

  it('Iterable', function() {
    const result = [ ...tvs ].map(node => node.id);

    assert.deepStrictEqual(result, simpleTreeDataOrder);
  });
});

describe('TreeViewState: Mutation', function() {
  describe('set', function() {
    const tvs = createFromSimpleData();
    const next = tvs.set('n0', { expanded: true });
    const n0 = tvs.get('n0');
    const nextN0 = next.get('n0');

    it('immutable', function() {
      assert(tvs !== next);
      assert.notDeepStrictEqual(n0, nextN0);
    });

    it('actually sets', function() {
      assert.strictEqual(nextN0.expanded, true);
    });

    it('pure', function() {
      assert.notDeepStrictEqual(nextN0, n0);
    });
  });

  describe('touch', function() {
    const tvs = createFromSimpleData();
    const next = tvs.touch('n011');
    const n011 = tvs.get('n011');
    const nextN011 = next.get('n011');

    it('immutable', function() {
      assert(tvs !== next);
    });

    it('pure', function() {
      assert.deepStrictEqual(n011, nextN011);
    });
  });

  describe('update', function() {
    const id = 'n0000';
    const state = createFromSimpleData();
    const nextState = state.update(id, { expanded: true });
    const n0000 = state.get(id);
    const nextN0000 = nextState.get(id);
    const parents = [ ...state.parents(id) ];
    const nextParents = [ ...nextState.parents(id )];

    it('immutable', function() {
      assert(nextState !== state);
    });

    it('parents are updated', function() {
      for (let i=0; i < parents.length; ++i) {
        assert(parents[i] !== nextParents[i]);
        assert.deepStrictEqual(parents[i], nextParents[i]);
      }
    });

    it('applies update', function() {
      assert(n0000 !== nextN0000);
      assert(nextN0000.expanded, true);
    });

    it('clones exactly 1x', function() {
      const state = createFromSimpleData();
      spy(state, 'clone');
      state.update('n0000', { expanded: true });

      assert(state.clone.calledOnce);
      state.clone.restore();
    });
  });
});
