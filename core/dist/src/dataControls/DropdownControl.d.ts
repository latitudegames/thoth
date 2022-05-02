import { DataControl } from '../plugins/inspectorPlugin';
export declare class DropdownControl extends DataControl {
    constructor({ name, dataKey, values, defaultValue, icon, write, }: {
        name: string;
        dataKey: string;
        defaultValue: string;
        values: string[];
        icon?: string;
        write?: boolean;
    });
}
