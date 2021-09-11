export class EnkiThroughputControl extends DataControl {
    constructor({ socketType, taskType, nodeId, icon, }: {
        socketType?: string | undefined;
        taskType?: string | undefined;
        nodeId: any;
        icon?: string | undefined;
    });
    socketType: string;
}
import { DataControl } from "../plugins/inspectorPlugin";
