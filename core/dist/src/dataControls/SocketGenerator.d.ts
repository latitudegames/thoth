import { DataControl } from '../plugins/inspectorPlugin';
export declare class SocketGeneratorControl extends DataControl {
    connectionType: string;
    constructor({ socketType, taskType, ignored, icon, connectionType, name: nameInput, }: {
        socketType?: string;
        taskType?: string;
        ignored?: string[];
        icon?: string;
        connectionType: 'input' | 'output';
        name: string;
    });
}
