import { DataSocketType, IRunContextEditor, ThothNode } from '../../../types';
import { ThothComponent } from '../../thoth-component';
import { DataControl } from './DataControl';
declare type InspectorConstructor = {
    component: ThothComponent<unknown>;
    editor: IRunContextEditor;
    node: ThothNode;
};
declare type DataControlData = Record<string, any>;
export declare type InspectorData = {
    name: string;
    nodeId: number;
    dataControls: Record<string, any>;
    data: Record<string, unknown>;
    category?: string;
    info: string;
    deprecated: boolean;
    deprecationMessage: string;
};
export declare class Inspector {
    cache: Record<string, any>;
    node: ThothNode;
    component: ThothComponent<unknown>;
    editor: IRunContextEditor;
    dataControls: Map<string, DataControl>;
    category: string;
    info: string;
    constructor({ component, editor, node }: InspectorConstructor);
    _add(list: Map<string, DataControl>, control: DataControl): void;
    add(dataControl: DataControl): this;
    handleSockets(sockets: DataSocketType[], control: DataControlData, type: 'inputs' | 'outputs'): void;
    cacheControls(dataControls: DataControlData): void;
    handleLock(update: Record<string, any>): void;
    handleDefaultTrigger(update: Record<string, any>): void;
    handleData(update: Record<string, any>): void;
    get(): void;
    data(): InspectorData;
    remove(): void;
}
export {};
