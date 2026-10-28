/** Optimal 4-direction A* search over a rectangular grid (0=open, 1=wall). */
export function manhattan(a,b){return Math.abs(a.row-b.row)+Math.abs(a.col-b.col)}
const key=(r,c)=>`${r},${c}`;

class MinHeap {
  constructor(){this.items=[]}
  get size(){return this.items.length}
  less(a,b){return a.f<b.f || (a.f===b.f&&(a.h<b.h||(a.h===b.h&&a.order<b.order)))}
  push(v){const a=this.items;a.push(v);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(!this.less(a[i],a[p]))break;[a[p],a[i]]=[a[i],a[p]];i=p}}
  pop(){const a=this.items;if(!a.length)return null;const top=a[0],last=a.pop();if(a.length){a[0]=last;let i=0;for(;;){let left=i*2+1,right=left+1,small=i;if(left<a.length&&this.less(a[left],a[small]))small=left;if(right<a.length&&this.less(a[right],a[small]))small=right;if(small===i)break;[a[i],a[small]]=[a[small],a[i]];i=small}}return top}
}

export function findPath(grid,start,goal){
  if(!Array.isArray(grid)||grid.length===0||!Array.isArray(grid[0])||grid[0].length===0)throw new Error('Grid must be a nonempty 2D array.');
  const rows=grid.length,cols=grid[0].length;
  if(grid.some(row=>!Array.isArray(row)||row.length!==cols||row.some(x=>x!==0&&x!==1)))throw new Error('Grid must be rectangular and contain only 0 or 1.');
  const valid=p=>p&&Number.isInteger(p.row)&&Number.isInteger(p.col)&&p.row>=0&&p.row<rows&&p.col>=0&&p.col<cols;
  if(!valid(start)||!valid(goal))throw new Error('Start and goal must be inside the grid.');
  if(grid[start.row][start.col]===1||grid[goal.row][goal.col]===1)throw new Error('Start and goal cannot be on walls.');
  const open=new MinHeap(),cost=new Map(),parent=new Map(),closed=new Set(),visited=[];
  const begin=key(start.row,start.col),end=key(goal.row,goal.col);
  let insertion=0,frontierPeak=1;
  const heuristic=manhattan(start,goal);
  cost.set(begin,0);open.push({row:start.row,col:start.col,g:0,h:heuristic,f:heuristic,order:insertion++});
  const directions=[[0,1],[1,0],[0,-1],[-1,0]];
  while(open.size){
    const current=open.pop(),id=key(current.row,current.col);
    if(closed.has(id)||current.g!==cost.get(id))continue;
    closed.add(id);visited.push({row:current.row,col:current.col});
    if(id===end){
      const path=[];let node=id;
      while(node){const [row,col]=node.split(',').map(Number);path.push({row,col});node=parent.get(node)}
      path.reverse();return {found:true,path,visited,steps:path.length-1,explored:visited.length,frontierPeak};
    }
    for(const [dr,dc] of directions){
      const row=current.row+dr,col=current.col+dc;
      if(row<0||row>=rows||col<0||col>=cols||grid[row][col]===1)continue;
      const next=key(row,col),newG=current.g+1;
      if(closed.has(next)||newG>=(cost.get(next)??Infinity))continue;
      cost.set(next,newG);parent.set(next,id);
      const h=manhattan({row,col},goal);
      open.push({row,col,g:newG,h,f:newG+h,order:insertion++});
      frontierPeak=Math.max(frontierPeak,open.size);
    }
  }
  return {found:false,path:[],visited,steps:null,explored:visited.length,frontierPeak};
}
