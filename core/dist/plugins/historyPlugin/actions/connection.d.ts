export class AddConnectionAction extends Action {
    constructor(editor: any, connection: any);
    helper: ConnectionActionHelper;
}
export class RemoveConnectionAction extends Action {
    constructor(editor: any, connection: any);
    helper: ConnectionActionHelper;
}
import Action from "../action";
declare class ConnectionActionHelper {
    constructor(editor: any, connection: any);
    editor: any;
    connection: any;
    add(): void;
    remove(): void;
}
export {};
