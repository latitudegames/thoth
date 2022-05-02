import { NodeView } from 'rete/types/view/node';
import { IRunContextEditor, NodeData } from '../../../types';
import { ThothComponent } from '../../thoth-component';
declare type ConsoleConstructor = {
    component: ThothComponent<unknown>;
    editor: IRunContextEditor;
    node: NodeData;
    server: boolean;
    throwError?: Function;
    isEngine?: boolean;
};
export declare type Message = {
    from: string;
    nodeId: number;
    name: string | null;
    content?: string;
    type: 'error' | 'log';
};
export declare class ThothConsole {
    node: NodeData;
    editor: IRunContextEditor;
    component: ThothComponent<unknown>;
    nodeView: NodeView;
    isServer: boolean;
    throwError?: Function;
    isEngine: boolean;
    constructor({ component, editor, node, server, throwError, isEngine, }: ConsoleConstructor);
    updateNodeView(): void;
    formatMessage(_message: string, type: 'error' | 'log'): Message;
    formatErrorMessage(error: any): Message;
    renderError(): void;
    renderLog(): void;
    log(_message: any): void;
    error(error: any): void;
    sendSuccess(result: any): void;
    sendToDebug(message: any): void;
    throwServerError(message: any): void;
}
export {};
