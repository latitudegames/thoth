import { DataControl } from '../plugins/inspectorPlugin';
export declare class ModelControl extends DataControl {
    constructor({ name, dataKey, defaultValue, icon, write, }: {
        name: string;
        dataKey: string;
        defaultValue: string;
        icon?: string;
        write?: boolean;
    });
}
