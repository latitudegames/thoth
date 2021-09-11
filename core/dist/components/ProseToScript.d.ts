import { ThothReteComponent } from "./ThothReteComponent";
export declare class ProseToScript extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any, { silent, thoth }: {
        silent: any;
        thoth: any;
    }): Promise<{
        detectedItem: any;
    }>;
}
