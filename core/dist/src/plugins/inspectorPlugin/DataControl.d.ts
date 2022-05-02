import { Node, NodeEditor } from 'rete';
import { ThothComponent } from '../../thoth-component';
import { Inspector } from './Inspector';
export declare type RestProps = {};
export declare abstract class DataControl {
    inspector: Inspector | null;
    editor: NodeEditor | null;
    node: Node | null;
    component: ThothComponent<unknown> | null;
    id: string | null;
    dataKey: string;
    key: string;
    name: string;
    defaultValue: unknown;
    componentData: object;
    componentKey: string;
    options: object;
    icon: string;
    write: boolean;
    data: Record<string, unknown>;
    constructor({ dataKey, name, component, data, options, write, icon, defaultValue, }: {
        dataKey: string;
        name: string;
        component: string;
        data?: Record<string, unknown>;
        options?: Record<string, unknown>;
        write?: boolean;
        icon?: string;
        defaultValue?: unknown;
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
    onAdd(): void;
    onData?: (...args: any[]) => Promise<void> | void;
}
