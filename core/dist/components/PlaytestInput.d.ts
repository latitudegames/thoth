import { ThothReteComponent } from "./ThothReteComponent";
import { Task } from "../plugins/taskPlugin/task";
export declare class PlaytestInput extends ThothReteComponent {
    initialTask?: Task;
    constructor();
    subscriptionMap: {};
    unsubscribe?: () => void;
    subscribeToPlaytest(node: any): void;
    destroyed(node: any): void;
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any, { data, silent }: {
        data: any;
        silent: any;
    }): {
        text: any;
    };
}
