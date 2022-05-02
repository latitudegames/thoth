import { DataControl } from '../plugins/inspectorPlugin';
export declare class SpellControl extends DataControl {
    constructor({ name, icon, write, defaultValue, }: {
        name: string;
        icon?: string;
        write: boolean;
        defaultValue?: string;
    });
}
