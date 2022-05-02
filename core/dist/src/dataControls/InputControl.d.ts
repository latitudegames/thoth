import { DataControl } from '../plugins/inspectorPlugin';
export declare class InputControl extends DataControl {
    constructor({ dataKey, name, icon, defaultValue, }: {
        dataKey: string;
        name: string;
        icon?: string;
        defaultValue?: unknown;
    });
    onData: () => void;
}
