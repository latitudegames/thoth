import { ThothReteComponent } from "./ThothReteComponent";
export declare class ForEach extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any, { element }: {
        element: any;
    }): Promise<{
        element: any;
    } | undefined>;
}
