import treeWalk from '../treeWalk';
import assert from 'power-assert';
import { simpleTreeData } from './fixtures';

describe('treeWalk', function(){
  it('Walks PreOrder', function() {
    const preOrder = [
      'n0',
      'n00',
      'n000',
      'n0000',
      'n01',
      'n010',
      'n011',
      'n0110',
      'n0111',
      'n012'
    ];
    let preOrderIndex = 0;

    for(let nd of treeWalk(simpleTreeData)) {
      assert.equal(nd.id, preOrder[preOrderIndex++]);
    }
  });
});
