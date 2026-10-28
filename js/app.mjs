import {findPath} from './astar.mjs';
const $=id=>document.getElementById(id);
const ROWS=15,COLS=21;
let grid=[],start={row:7,col:2},goal={row:7,col:18},mode='wall',dragging=false,animationId=0,busy=false;
const nodes=[],visited=new Set(),path=new Set();
const key=(r,c)=>r*COLS+c;
const wait=delay=>new Promise(resolve=>setTimeout(resolve,delay));
function newGrid(){return Array.from({length:ROWS},()=>Array(COLS).fill(0))}
function sample(){grid=newGrid();start={row:7,col:2};goal={row:7,col:18};
 for(let r=0;r<ROWS;r++){if(r!==2&&r!==11)grid[r][5]=1;if(r!==5&&r!==12)grid[r][10]=1;if(r!==3&&r!==9)grid[r][15]=1}
 for(let c=5;c<=10;c++)if(c!==8)grid[3][c]=1;
 for(let c=10;c<=15;c++)if(c!==13)grid[11][c]=1;
 grid[start.row][start.col]=0;grid[goal.row][goal.col]=0;
}
function randomMap(){grid=newGrid();start={row:7,col:2};goal={row:7,col:18};for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(Math.random()<.24)grid[r][c]=1;grid[start.row][start.col]=0;grid[goal.row][goal.col]=0}
function blockedMap(){grid=newGrid();start={row:7,col:2};goal={row:7,col:18};for(const [dr,dc] of [[0,1],[1,0],[0,-1],[-1,0]])grid[goal.row+dr][goal.col+dc]=1}
function cancel(){animationId++;busy=false;visited.clear();path.clear();$('solveBtn').disabled=false;}
function info(text,warning=false){$('info').textContent=text;$('info').classList.toggle('warning',warning)}
function resetStats(){for(const id of ['pathLength','explored','frontier'])$(id).textContent='—';}
function updateCell(i){const r=Math.floor(i/COLS),c=i%COLS,node=nodes[i];
 const isStart=r===start.row&&c===start.col,isGoal=r===goal.row&&c===goal.col;
 node.className='tile'+(grid[r][c]?' wall':'')+(visited.has(i)?' visited':'')+(path.has(i)?' path':'')+(isStart?' start':'')+(isGoal?' goal':'');
 node.textContent=isStart?'S':isGoal?'G':'';
 node.setAttribute('aria-label',`Row ${r+1}, column ${c+1}, ${isStart?'start':isGoal?'goal':grid[r][c]?'wall':path.has(i)?'solution path':visited.has(i)?'explored':'open'}`);
}
function drawAll(){for(let i=0;i<nodes.length;i++)updateCell(i)}
function resetVisual(){cancel();resetStats();drawAll();info('Choose a tool, edit the grid, then find the shortest path.')}
function changeAt(r,c){if(busy)return;const atStart=r===start.row&&c===start.col,atGoal=r===goal.row&&c===goal.col;
 if(mode==='start'){if(atGoal)return;start={row:r,col:c};grid[r][c]=0}
 else if(mode==='goal'){if(atStart)return;goal={row:r,col:c};grid[r][c]=0}
 else if(!atStart&&!atGoal)grid[r][c]=mode==='wall'?1:0;
 visited.clear();path.clear();resetStats();drawAll();info('Grid updated. Run A* to calculate a new route.');
}
function setupCells(){const board=$('mazeGrid');board.style.setProperty('--cols',COLS);
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
  const cell=document.createElement('button');cell.type='button';cell.className='tile';cell.dataset.row=r;cell.dataset.col=c;board.append(cell);nodes.push(cell);
  cell.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();dragging=true;changeAt(r,c)});
  cell.addEventListener('pointerenter',()=>{if(dragging&&(mode==='wall'||mode==='erase'))changeAt(r,c)});
  cell.addEventListener('click',()=>{if(!dragging)changeAt(r,c)});
 }
 window.addEventListener('pointerup',()=>{dragging=false});window.addEventListener('pointercancel',()=>{dragging=false});
}
function setTool(next){mode=next;document.querySelectorAll('[data-tool]').forEach(b=>{const active=b.dataset.tool===mode;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});$('activeTool').textContent=mode.toUpperCase()}
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;const shortcut={w:'wall',e:'erase',s:'start',g:'goal'}[e.key.toLowerCase()];if(shortcut)setTool(shortcut)});
function usePreset(preset){cancel();if(preset==='random')randomMap();else if(preset==='blocked')blockedMap();else if(preset==='empty'){grid=newGrid();start={row:7,col:2};goal={row:7,col:18}}else sample();resetVisual()}
$('preset').addEventListener('change',e=>usePreset(e.target.value));$('clearBtn').addEventListener('click',()=>usePreset('empty'));
$('speed').addEventListener('input',e=>{$('speedValue').textContent=`${e.target.value}/10`});
$('solveBtn').addEventListener('click',async()=>{
 cancel();drawAll();const thisRun=animationId;busy=true;$('solveBtn').disabled=true;
 let result;try{result=findPath(grid,start,goal)}catch(e){info(e.message,true);busy=false;$('solveBtn').disabled=false;return}
 $('pathLength').textContent=result.found?String(result.steps):'NO PATH';$('explored').textContent=String(result.explored);$('frontier').textContent=String(result.frontierPeak);
 info(result.found?'Searching the state-space…':'Scanning accessible nodes…');
 const speed=Number($('speed').value),stepDelay=Math.max(2,32-speed*3);
 const perTick=speed>=8?9:speed>=5?4:2;
 for(let i=0;i<result.visited.length;i+=perTick){
  if(thisRun!==animationId)return;
  for(const p of result.visited.slice(i,i+perTick)){const id=key(p.row,p.col);visited.add(id);updateCell(id)}
  await wait(stepDelay);
 }
 if(thisRun!==animationId)return;
 if(result.found){for(const p of result.path){if(thisRun!==animationId)return;const id=key(p.row,p.col);path.add(id);updateCell(id);await wait(Math.max(3,stepDelay*1.4))}
  info(`Optimal route found: ${result.steps} moves. Manhattan distance heuristic (4-way movement).`);
 }else info('No route exists. The goal is unreachable with the current walls.',true);
 busy=false;$('solveBtn').disabled=false;
});
setupCells();sample();setTool('wall');drawAll();
