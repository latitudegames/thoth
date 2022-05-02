import { DataControl } from '../plugins/inspectorPlugin';
export declare class SwitchControl extends DataControl {
    constructor({ dataKey, name, icon, label, defaultValue, }: {
        dataKey: string;
        name: string;
        icon?: string;
        label: string;
        defaultValue?: unknown;
    });
    onData: () => void;
}
