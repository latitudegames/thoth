import { NodeEditor } from 'rete';
import { Data } from 'rete/types/core/data';
import { EventsTypes, EditorContext } from '../types';
import { ModuleManager } from './plugins/modulePlugin/module-manager';
import { Task } from './plugins/taskPlugin';
import { PubSubContext } from './thoth-component';
export declare class ThothEditor extends NodeEditor<EventsTypes> {
    tasks: Task[];
    pubSub: PubSubContext;
    thoth: EditorContext;
    tab: {
        type: string;
    };
    abort: unknown;
    loadGraph: (graph: Data, relaoding?: boolean) => Promise<void>;
    moduleManager: ModuleManager;
    runProcess: (callback?: Function) => Promise<void>;
    onSpellUpdated: (spellId: string, callback: Function) => Function;
}
export declare const initEditor: ({ container, pubSub, thoth, tab, node, }: {
    container: any;
    pubSub: any;
    thoth: any;
    tab: any;
    node: any;
}) => Promise<ThothEditor>;
