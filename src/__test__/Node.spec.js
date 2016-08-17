import Node from '../Node';
import assert from 'power-assert';

const rawData = {
  resourceId: '2322323',
  label: 'n0',
  guid: 'n0',
};

const data = {
  id: 'n0',
  text: 'n0',
  children: [],
  data: rawData
};

describe('Node', function() {
  describe('Initialization', function() {
    it('Initializes', function() {
      const node = new Node();
      assert(node);
    });

    it('Initializes with mapping', function() {
      const node = Node.createFromData(rawData, d => ({
        id: d.guid,
        text: d.label,
        data: d
      }));

      assert(node);
    });

    it('Initialize from parent', function() {
      const parentNode = new Node(data);
      const node = Node.createFromParent(parentNode, { id: 'x', text: 'yy'});

      assert(node);
      assert(node.parentId === parentNode.id);
    });

    it('Initializes with create', function() {
      const node = Node.create(data);

      assert(node);
    });
  });

  describe('Cloning', function() {
    const state = new Node(data);
    const nextState = state.clone();

    it('Creates new reference', function() {
      assert(state !== nextState);
    });

    it('Maintains prototype chain', function() {
      assert(nextState instanceof Node);
    });

    it('Is Deep equal', function() {
      assert.deepStrictEqual(state, nextState);
    });
  });

  describe('Instance Methods', function() {
    describe('set', function() {
      const state = new Node(data);
      const nextState = state.set({ randomProp: true });

      it('Creates new reference', function() {
        assert(state !== nextState);
      });

      it('Adds prop', function() {
        assert(nextState.randomProp === true);
      });
    });

    describe('expand & collapse', function() {
      const state = new Node(data);
      const expandedState = state.expand();

      it('Expands', function() {
        assert.strictEqual(expandedState.expanded, true);
      });

      it('Collapses', function() {
        const collapsedState = expandedState.collapse();

        assert.strictEqual(collapsedState.expanded, false);
      });
    });
  });

  describe('Static Methods', function() {
    it('isParent', function() {
      const state = new Node(data);
      const nextState = state.set({ childIds: ['sdsslds'] });

      assert.strictEqual(Node.isParent(state), false);
      assert.strictEqual(Node.isParent(nextState), true);
    });
  });

});
