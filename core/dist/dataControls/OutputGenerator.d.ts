export class OutputGeneratorControl extends DataControl {
    constructor({ socketType, taskType, ignored, icon, }: {
        socketType?: string | undefined;
        taskType?: string | undefined;
        ignored?: any[] | undefined;
        icon?: string | undefined;
    });
    socketType: string;
}
import { DataControl } from "../plugins/inspectorPlugin";
