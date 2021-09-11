import { ThothReteComponent } from "./ThothReteComponent";
export declare class StringProcessor extends ThothReteComponent {
    constructor();
    node: {};
    builder(node: any): any;
    worker(node: any, inputs: any, data: any): Promise<{}>;
}
