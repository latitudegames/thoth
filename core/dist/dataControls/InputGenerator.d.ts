export class InputGeneratorControl extends DataControl {
    constructor({ defaultOutputs, socketType, taskType, ignored, icon, }: {
        defaultOutputs?: any[] | undefined;
        socketType?: string | undefined;
        taskType?: string | undefined;
        ignored?: any[] | undefined;
        icon?: string | undefined;
    });
}
import { DataControl } from "../plugins/inspectorPlugin";
