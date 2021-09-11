import { ThothReteComponent } from "./ThothReteComponent";
export declare class SwitchGate extends ThothReteComponent {
    constructor();
    node: {};
    builder(node: any): any;
    worker(node: any, inputs: any, data: any): Promise<void>;
}
