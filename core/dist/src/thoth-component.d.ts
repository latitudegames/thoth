import { Socket } from 'rete';
import { PubSubBase, ThothEditor, ThothNode } from '../types';
import { ThothEngineComponent } from './engine';
import { Task, TaskOptions } from './plugins/taskPlugin/task';
export declare type PubSubContext = {
    publish: (event: string, data: unknown) => boolean;
    subscribe: (event: string, callback: Function) => void;
    events: Record<string, (tabId: string) => string>;
    PubSub: PubSubBase;
};
export interface ThothTask extends Task {
    outputs?: {
        [key: string]: string;
    };
    init?: (task?: ThothTask, node?: ThothNode) => void;
    onRun?: Function;
}
export interface ModuleOptions {
    nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module';
    socket?: Socket;
    skip?: boolean;
}
export declare abstract class ThothComponent<WorkerReturnType> extends ThothEngineComponent<WorkerReturnType> {
    task: TaskOptions;
    _task: ThothTask;
    editor: ThothEditor | null;
    data: unknown;
    category: string;
    info: string;
    display: boolean;
    deprecated: boolean;
    dev: boolean;
    hide: boolean;
    deprecationMessage: string | undefined;
    module: ModuleOptions;
    contextMenuName: string | undefined;
    workspaceType: 'module' | 'spell' | null | undefined;
    displayName: string | undefined;
    constructor(name: string);
    abstract builder(node: ThothNode): Promise<ThothNode> | ThothNode | void;
    build(node: ThothNode): Promise<ThothNode>;
    createNode(data?: {}): Promise<ThothNode>;
}
