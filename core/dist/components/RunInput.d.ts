import { ThothReteComponent } from "./ThothReteComponent";
import { Task } from "../plugins/taskPlugin/task";
export declare class RunInputComponent extends ThothReteComponent {
    initialTask?: Task;
    subscriptionMap: any;
    constructor();
    destroyed(node: any): void;
    builder(node: any): any;
    worker(node: any, inputs: any, data: any): Promise<{
        text: any;
    }>;
}
