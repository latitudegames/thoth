export class AddNodeAction extends NodeAction {
}
export class RemoveNodeAction extends NodeAction {
}
export class DragNodeAction extends NodeAction {
    constructor(editor: any, node: any, prev: any);
    prev: any[];
    new: any[];
    _translate(position: any): void;
    update(node: any): void;
}
declare class NodeAction extends Action {
    constructor(editor: any, node: any);
    editor: any;
    node: any;
}
import Action from "../action";
export {};
