import { Component, Connection, Input, Output, NodeEditor } from 'rete';
import { Node } from 'rete/types';
import { NodeData as ReteNodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { Inspector } from './src/plugins/inspectorPlugin/Inspector';
import { TaskOutputTypes } from './src/plugins/taskPlugin/task';
import { SocketNameType, SocketType } from './src/sockets';
import { ThothTask } from './src/thoth-component';
import { ThothConsole } from './src/plugins/debuggerPlugin/ThothConsole';
import { Data } from 'rete/types/core/data';
export { ThothComponent } from './src/thoth-component';
export { ThothEditor } from './src/editor';
export type { InspectorData } from './src/plugins/inspectorPlugin/Inspector';
export declare type ImageType = {
    id: string;
    captionId: string;
    imageCaption: string;
    imageUrl: string;
    tag: string;
    score: number | string;
};
export declare type ImageCacheResponse = {
    images: ImageType[];
};
export declare type EngineContext = {
    completion: (body: ModelCompletionOpts) => Promise<string | OpenAIResultChoice | undefined>;
    getCurrentGameState: () => Record<string, unknown>;
    setCurrentGameState: (state: Record<string, unknown>) => void;
    updateCurrentGameState: (update: Record<string, unknown>) => void;
    enkiCompletion: (taskName: string, inputs: string[] | string) => Promise<{
        outputs: string[];
    }>;
    huggingface: (model: string, request: string) => Promise<{
        error?: unknown;
        [key: string]: unknown;
    }>;
    runSpell: (flattenedInputs: Record<string, any>, spellId: string, state: Record<string, any>) => Record<string, any>;
    readFromImageCache: (caption: string, cacheTag?: string, topK?: number) => Promise<ImageCacheResponse>;
    processCode: (code: unknown, inputs: ThothWorkerInputs, data: Record<string, any>, state: Record<string, any>) => any | void;
};
export declare type EventPayload = Record<string, any>;
export interface EditorContext extends EngineContext {
    onTrigger: (node: ThothNode | string, callback: Function) => Function;
    sendToPlaytest: (data: string) => void;
    sendToInspector: (data: EventPayload) => void;
    sendToDebug: (data: EventPayload) => void;
    onInspector: (node: ThothNode, callback: Function) => Function;
    onPlaytest: (callback: Function) => Function;
    onDebug: (node: NodeData, callback: Function) => Function;
    clearTextEditor: () => void;
    getCurrentGameState: () => Record<string, unknown>;
    updateCurrentGameState: (update: EventPayload) => void;
    processCode: (code: unknown, inputs: ThothWorkerInputs, data: Record<string, any>, state: Record<string, any>) => any | void;
}
export declare type EventsTypes = {
    run: void;
    save: void;
    [key: string]: unknown;
    connectionpath: {
        points: number[];
        connection: Connection;
        d: string;
    };
    connectiondrop: Input | Output;
    connectionpick: Input | Output;
    resetconnection: void;
};
export interface Spell {
    id?: string;
    user?: Record<string, unknown> | null | undefined;
    name: string;
    chain: ChainData;
    gameState: Record<string, unknown>;
    createdAt?: number;
    updatedAt?: number;
}
export interface IRunContextEditor extends NodeEditor {
    thoth: EditorContext;
    abort: Function;
}
export declare type DataSocketType = {
    name: SocketNameType;
    taskType: 'output' | 'option';
    socketKey: string;
    connectionType: 'input' | 'output';
    socketType: SocketType;
    useSocketName: boolean;
};
export declare type ThothNode = Node & {
    inspector: Inspector;
    display: (content: string) => void;
    outputs: {
        name: string;
        [key: string]: unknown;
    }[];
    category?: string;
    deprecated?: boolean;
    displayName?: string;
    info: string;
    subscription: Function;
    console: ThothConsole;
};
export declare type ModuleType = {
    id: string;
    name: string;
    data: ChainData;
    createdAt: number;
    updatedAt: number;
};
export declare type ModelCompletionOpts = {
    model?: string;
    prompt?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    n?: number;
    stream?: boolean;
    logprobs?: number;
    echo?: boolean;
    stop?: string | string[];
    presencePenalty?: number;
    frequencyPenalty?: number;
    bestOf?: number;
    user?: string;
    logitBias?: {
        [token: string]: number;
    };
};
export declare type OpenAIResultChoice = {
    text: string;
    index: number;
    logprobs: number[];
    top_logprobs: any[];
    text_offset: number[];
};
export declare type OpenAIResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: OpenAIResultChoice[];
    finish_reason: string;
};
export declare type Subspell = {
    name: string;
    id: string;
    data: ChainData;
};
export declare type ModuleComponent = Component & {
    run: Function;
    nodeTaskMap: Map<string, any>;
};
export declare type NodeConnections = {
    node: number;
    input?: string;
    output?: string;
    data: Record<string, unknown>;
};
export declare type NodeOutputs = {
    output?: {
        connections: NodeConnections[];
    };
    trigger?: {
        connections: NodeConnections[];
    };
    action?: {
        connections: NodeConnections[];
    };
};
export declare type ChainData = Data;
export declare type NodeData = ReteNodeData & {
    fewshot?: string;
    display: Function;
    error?: boolean;
    console: ThothConsole;
};
export declare type ThothReteInput = {
    type: TaskOutputTypes;
    outputData: unknown;
    task: ThothTask;
    key: string;
};
export declare type TaskOutput = {
    type: TaskOutputTypes;
    task: ThothTask;
    key: string;
};
export declare type ModuleWorkerOutput = WorkerOutputs & {
    [key: string]: any;
};
export declare type ThothWorkerInput = string | unknown | unknown[];
export declare type ThothWorkerInputs = {
    [key: string]: ThothWorkerInput[];
};
export declare type ThothWorkerOutputs = WorkerOutputs & {
    [key: string]: TaskOutput;
};
export declare type WorkerReturn = Node | ThothWorkerOutputs | void | Promise<void> | Promise<{
    actionType: string;
}> | Promise<{
    difficulty?: string;
    category?: string;
}> | Promise<{
    [output: string]: string;
} | null> | Promise<never[] | {
    entities: {
        name: string;
        type: string;
    }[];
}> | Promise<{
    element: unknown;
} | undefined> | Promise<{
    result: {
        error: unknown;
        [key: string]: unknown;
    };
} | {
    result?: undefined;
}> | Promise<{
    text: unknown;
}> | Promise<{
    boolean: boolean;
}> | Promise<null | undefined> | WorkerOutputs[] | {
    trigger: boolean;
};
export declare type ThothWorker = (node: ThothNode, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) => WorkerReturn;
export interface PubSubBase extends CountSubscriptions, ClearAllSubscriptions, GetSubscriptions, Publish, Subscribe, Unsubscribe {
    name: string;
    version: string;
}
interface CountSubscriptions {
    countSubscriptions(token: any): number;
}
interface ClearAllSubscriptions {
    clearAllSubscriptions(token?: any): void;
}
interface GetSubscriptions {
    getSubscriptions(token: any): any[];
}
interface Publish {
    publish(message: string | symbol, data?: any): boolean;
    publishSync(message: string | symbol, data?: any): boolean;
}
interface Subscribe {
    subscribe(message: string | symbol, func: Function): string;
    subscribeOnce(message: string | symbol, func: Function): any;
}
interface Unsubscribe {
    unsubscribe(tokenOrFunction: any): any;
}
