export interface Command{execute():void;undo():void}
export class History {private undoStack:Command[]=[];private redoStack:Command[]=[];run(c:Command){c.execute();this.undoStack.push(c);this.redoStack=[]}undo(){const c=this.undoStack.pop();if(c){c.undo();this.redoStack.push(c)}}redo(){const c=this.redoStack.pop();if(c){c.execute();this.undoStack.push(c)}}get canUndo(){return!!this.undoStack.length}get canRedo(){return!!this.redoStack.length}}
export const history=new History();
