import treeWalk from '../treeWalk';
import assert from 'power-assert';
import { simpleTreeData, simpleTreeDataOrder } from './fixtures';

describe('treeWalk', function(){
  it('Walks PreOrder', function() {
    let index = 0;

    for(let nd of treeWalk(simpleTreeData)) {
      assert.equal(nd.id, simpleTreeDataOrder[index++]);
    }
  });
});
