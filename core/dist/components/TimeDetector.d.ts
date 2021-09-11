import { ThothReteComponent } from "./ThothReteComponent";
export declare class TimeDetectorComponent extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any, { silent, thoth }: {
        silent: any;
        thoth: any;
    }): Promise<{
        detectedTime: any;
    }>;
}
