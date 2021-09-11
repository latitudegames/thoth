import { Inspector } from "./Inspector";
import { Node, NodeEditor, Component } from "rete";
export declare class DataControl {
    inspector: Inspector | null;
    editor: NodeEditor | null;
    node: Node | null;
    component: Component | null;
    id: string | null;
    dataKey: string;
    name: string;
    componentData: object;
    componentKey: string;
    options: object;
    icon: string;
    write: boolean;
    constructor({ dataKey, name, component, data, options, write, icon, ...rest }: {
        [x: string]: any;
        dataKey: any;
        name: any;
        component: any;
        data?: {} | undefined;
        options?: {} | undefined;
        write?: boolean | undefined;
        icon?: string | undefined;
    });
    get control(): {
        dataKey: string;
        name: string;
        component: string;
        data: object;
        options: object;
        id: string | null;
        icon: string;
    };
    onAdd(data: any): Promise<void>;
    onData(data: any): Promise<void>;
}
