import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import type { Asset, Canvas, CanvasNode, Edge, Group, ImportResult, SearchResult, WorkspaceData } from '../types';

const isTauri=()=>!!(window as any).__TAURI_INTERNALS__;
const key='infinite-canvas-demo';
const now=()=>Date.now(); const id=()=>crypto.randomUUID();
function demo():WorkspaceData { const c:Canvas={id:id(),name:'灵感画布',camera_x:0,camera_y:0,zoom:1,created_at:now(),updated_at:now()}; return {workspace:{name:'演示工作区',path:'browser://local'},canvases:[c],nodes:[],assets:[],edges:[],groups:[],recovery_needed:false}; }
function loadLocal(){try{return JSON.parse(localStorage.getItem(key)||'') as WorkspaceData}catch{return demo()}}
function saveLocal(d:WorkspaceData){localStorage.setItem(key,JSON.stringify(d));return d}
let local=loadLocal();
async function call<T>(cmd:string,args:any,fallback:()=>T|Promise<T>):Promise<T>{return isTauri()?invoke<T>(cmd,args):fallback()}
export const backend={
  createWorkspace:(path:string,name:string)=>call<WorkspaceData>('create_workspace',{path,name},()=>{local=demo();local.workspace={path,name};return saveLocal(local)}),
  openWorkspace:(path:string)=>call<WorkspaceData>('open_workspace',{path},()=>local),
  closeWorkspace:()=>call<void>('close_workspace',{},()=>{}),
  createCanvas:(name:string)=>call<Canvas>('create_canvas',{name},()=>{const c={id:id(),name,camera_x:0,camera_y:0,zoom:1,created_at:now(),updated_at:now()};local.canvases.push(c);saveLocal(local);return c}),
  updateCanvas:(canvas:Canvas)=>call<void>('update_canvas',{canvas},()=>{local.canvases=local.canvases.map(c=>c.id===canvas.id?canvas:c);saveLocal(local)}),
  trashCanvas:(id:string)=>call<void>('trash_canvas',{id},()=>{const c=local.canvases.find(x=>x.id===id);if(c)c.deleted_at=now();saveLocal(local)}),
  saveNodes:(nodes:CanvasNode[])=>call<void>('save_nodes',{nodes},()=>{for(const n of nodes){const i=local.nodes.findIndex(x=>x.id===n.id);i<0?local.nodes.push(n):local.nodes.splice(i,1,n)}saveLocal(local)}),
  trashNodes:(ids:string[])=>call<void>('trash_nodes',{ids},()=>{local.nodes.forEach(n=>{if(ids.includes(n.id))n.deleted_at=now()});saveLocal(local)}),
  restoreItems:(kind:string,ids:string[])=>call<void>('restore_items',{kind,ids},()=>{const rows:any[]=kind==='canvas'?local.canvases:kind==='node'?local.nodes:local.assets;rows.forEach(x=>{if(ids.includes(x.id))x.deleted_at=null});saveLocal(local)}),
  permanentlyDelete:(kind:string,ids:string[])=>call<void>('permanently_delete',{kind,ids},()=>{const p=kind==='canvas'?'canvases':kind==='node'?'nodes':'assets';(local as any)[p]=(local as any)[p].filter((x:any)=>!ids.includes(x.id));saveLocal(local)}),
  importFiles:(paths:string[])=>call<ImportResult[]>('import_files',{paths},()=>[]),
  createAssetFromBytes:(name:string,mimeType:string,bytes:number[])=>call<ImportResult>('import_bytes',{name,mimeType,bytes},()=>{throw new Error('浏览器预览模式不支持二进制托管，请运行桌面版')}),
  assetUrl:(asset:Asset)=>isTauri()?convertFileSrc(asset.storage_name):'',
  exportAsset:(assetId:string,path:string)=>call<void>('export_asset',{assetId,path},()=>{}),
  openAsset:(assetId:string)=>call<void>('open_asset',{assetId},()=>{}),
  openUrl:(url:string)=>call<void>('open_url',{url},()=>{window.open(url,'_blank')}),
  assetText:(assetId:string)=>call<string>('asset_text',{assetId},()=>''),
  saveEdges:(edges:Edge[])=>call<void>('save_edges',{edges},()=>{local.edges=edges;saveLocal(local)}),
  deleteEdges:(ids:string[])=>call<void>('delete_edges',{ids},()=>{local.edges=local.edges.filter(e=>!ids.includes(e.id));saveLocal(local)}),
  saveGroups:(groups:Group[])=>call<void>('save_groups',{groups},()=>{local.groups=groups;saveLocal(local)}),
  search:(query:string)=>call<SearchResult[]>('search',{query},()=>{const q=query.toLowerCase(),r:SearchResult[]=[];local.canvases.filter(c=>c.name.toLowerCase().includes(q)).forEach(c=>r.push({kind:'canvas',id:c.id,title:c.name,subtitle:'画布'}));local.nodes.filter(n=>(n.title+n.content_json).toLowerCase().includes(q)).forEach(n=>r.push({kind:'node',id:n.id,canvas_id:n.canvas_id,title:n.title||'无标题',subtitle:n.type,x:n.x,y:n.y}));return r}),
  markClean:()=>call<void>('mark_clean_shutdown',{},()=>{}),
};
