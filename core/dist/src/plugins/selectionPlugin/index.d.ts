import { NodeEditor } from 'rete';
declare module 'rete/types/events' {
    interface EventsTypes {
        multiselection: boolean;
    }
}
export interface Cfg {
    selectionArea?: {
        className?: string;
    };
    selectionMode?: {
        className?: string;
    };
    enabled?: boolean;
    mode?: [string, string];
}
export interface Position {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
declare function install(editor: NodeEditor, params: Cfg): void;
declare const _default: {
    name: string;
    install: typeof install;
};
export default _default;
