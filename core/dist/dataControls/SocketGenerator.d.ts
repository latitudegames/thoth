export class SocketGeneratorControl extends DataControl {
    constructor({ socketType, taskType, ignored, icon, connectionType, name: nameInput, }: {
        socketType?: string | undefined;
        taskType?: string | undefined;
        ignored?: any[] | undefined;
        icon?: string | undefined;
        connectionType: any;
        name: any;
    });
    connectionType: any;
}
import { DataControl } from "../plugins/inspectorPlugin";
