export type NodeType='text'|'todo'|'image'|'video'|'audio'|'file'|'link'|'frame'|'pdf'|'markdown'|'code';
export interface WorkspaceInfo {path:string;name:string;lastOpened?:number}
export interface Canvas {id:string;name:string;camera_x:number;camera_y:number;zoom:number;created_at:number;updated_at:number;deleted_at?:number|null}
export interface Asset {id:string;type:string;original_name:string;storage_name:string;extension:string;mime_type:string;size:number;hash:string;width?:number;height?:number;duration?:number;thumbnail_path?:string;created_at:number;updated_at:number;deleted_at?:number|null;usage_count?:number}
export interface CanvasNode {id:string;canvas_id:string;asset_id?:string|null;type:NodeType;x:number;y:number;width:number;height:number;rotation:number;z_index:number;title:string;content_json:string;style_json:string;created_at:number;updated_at:number;deleted_at?:number|null}
export interface Edge {id:string;canvas_id:string;source_node_id:string;target_node_id:string;type:'line'|'curve';label:string;style_json:string;created_at:number;updated_at:number}
export interface Group {id:string;canvas_id:string;name:string;node_ids:string[]}
export interface WorkspaceData {workspace:WorkspaceInfo;canvases:Canvas[];nodes:CanvasNode[];assets:Asset[];edges:Edge[];groups:Group[];recovery_needed:boolean}
export interface ImportResult {asset:Asset;deduplicated:boolean}
export interface SearchResult {kind:'canvas'|'node'|'asset';id:string;canvas_id?:string;title:string;subtitle:string;x?:number;y?:number}
