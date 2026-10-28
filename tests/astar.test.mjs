import test from 'node:test';
import assert from 'node:assert/strict';
import {findPath,manhattan} from '../js/astar.mjs';
const point=(row,col)=>({row,col});
test('Manhattan distance',()=>assert.equal(manhattan(point(1,2),point(5,7)),9));
test('start equals goal',()=>{const r=findPath([[0]],point(0,0),point(0,0));assert.equal(r.steps,0);assert.equal(r.path.length,1)});
test('straight shortest path',()=>{const r=findPath([[0,0,0,0]],point(0,0),point(0,3));assert.equal(r.steps,3)});
test('open grid shortest path',()=>{const r=findPath(Array.from({length:5},()=>Array(5).fill(0)),point(0,0),point(4,4));assert.equal(r.steps,8)});
test('obstacle detour path',()=>{const g=[[0,1,0],[0,1,0],[0,0,0]];assert.equal(findPath(g,point(0,0),point(0,2)).steps,6)});
test('unreachable goal detected',()=>{const g=[[0,1,0],[1,1,0],[0,0,0]];const r=findPath(g,point(0,0),point(2,2));assert.equal(r.found,false);assert.deepEqual(r.path,[])});
test('blocked start rejected',()=>assert.throws(()=>findPath([[1,0]],point(0,0),point(0,1))));
test('blocked goal rejected',()=>assert.throws(()=>findPath([[0,1]],point(0,0),point(0,1))));
test('nonrectangular grid rejected',()=>assert.throws(()=>findPath([[0],[0,0]],point(0,0),point(1,0))));
test('nonbinary grid rejected',()=>assert.throws(()=>findPath([[0,2]],point(0,0),point(0,1))));
test('out of bounds rejected',()=>assert.throws(()=>findPath([[0]],point(-1,0),point(0,0))));
test('empty grid rejected',()=>assert.throws(()=>findPath([],point(0,0),point(0,0))));
test('input grid is not mutated',()=>{const g=[[0,0],[0,0]];findPath(g,point(0,0),point(1,1));assert.deepEqual(g,[[0,0],[0,0]])});
test('returned path is contiguous and avoids walls',()=>{const g=[[0,0,0,1,0],[0,1,0,1,0],[0,1,0,0,0],[0,0,0,1,0]];const r=findPath(g,point(0,0),point(3,4));assert.equal(r.found,true);for(let i=0;i<r.path.length;i++){const p=r.path[i];assert.equal(g[p.row][p.col],0);if(i)assert.equal(manhattan(p,r.path[i-1]),1)}});
test('stats show explored states',()=>{const r=findPath([[0,0],[0,0]],point(0,0),point(1,1));assert.ok(r.explored>=3);assert.ok(r.frontierPeak>=1)});
test('A* matches independent BFS over deterministic random mazes',()=>{
 let seed=142857;const rand=()=>((seed= (Math.imul(1664525,seed)+1013904223)>>>0)/4294967296);
 for(let t=0;t<75;t++){
  const rows=6,cols=8,grid=Array.from({length:rows},()=>Array.from({length:cols},()=>rand()<.29?1:0));grid[0][0]=0;grid[5][7]=0;
  const r=findPath(grid,point(0,0),point(5,7));
  const queue=[[0,0,0]],seen=new Set(['0,0']);let expected=null;
  for(let h=0;h<queue.length;h++){const [row,col,d]=queue[h];if(row===5&&col===7){expected=d;break}
   for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=row+dr,nc=col+dc,k=`${nr},${nc}`;if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&!grid[nr][nc]&&!seen.has(k)){seen.add(k);queue.push([nr,nc,d+1])}}
  }
  assert.equal(r.steps,expected,`random maze #${t}`);
 }
});
