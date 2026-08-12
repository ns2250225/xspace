import { computed, ref } from 'vue';import { defineStore } from 'pinia';import type { Asset, Canvas, CanvasNode, Edge, Group, WorkspaceData } from '../types';import { backend } from '../services/backend';
export const useWorkspace=defineStore('workspace',()=>{
 const data=ref<WorkspaceData|null>(null), activeCanvasId=ref(''), selected=ref(new Set<string>()), assetFilter=ref('all');
 const activeCanvas=computed(()=>data.value?.canvases.find(c=>c.id===activeCanvasId.value&&!c.deleted_at));
 const nodes=computed(()=>data.value?.nodes.filter(n=>n.canvas_id===activeCanvasId.value&&!n.deleted_at)??[]); const edges=computed(()=>data.value?.edges.filter(e=>e.canvas_id===activeCanvasId.value)??[]);
 const assets=computed(()=>data.value?.assets.filter(a=>!a.deleted_at)??[]);
 function setData(d:WorkspaceData){data.value=d;activeCanvasId.value=d.canvases.find(c=>!c.deleted_at)?.id||''}
 async function createNode(partial:Partial<CanvasNode>){if(!data.value||!activeCanvasId.value)return;const t=Date.now();const n:CanvasNode={id:crypto.randomUUID(),canvas_id:activeCanvasId.value,type:'text',x:0,y:0,width:260,height:140,rotation:0,z_index:Math.max(0,...nodes.value.map(n=>n.z_index))+1,title:'',content_json:'{}',style_json:'{}',created_at:t,updated_at:t,...partial};data.value.nodes.push(n);await backend.saveNodes([n]);return n}
 async function saveNodes(ns:CanvasNode[]){await backend.saveNodes(ns)}
 async function trashSelected(){const ids=[...selected.value];if(!data.value||!ids.length)return;data.value.nodes.forEach(n=>{if(ids.includes(n.id))n.deleted_at=Date.now()});selected.value.clear();await backend.trashNodes(ids)}
 return {data,activeCanvasId,activeCanvas,selected,assetFilter,nodes,edges,assets,setData,createNode,saveNodes,trashSelected};
});
