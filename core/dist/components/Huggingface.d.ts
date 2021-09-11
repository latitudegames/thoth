import { ThothReteComponent } from "./ThothReteComponent";
export declare class HuggingfaceComponent extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, rawInputs: any, outputs: any, { thoth }: {
        thoth: any;
    }): Promise<{
        result: any;
    } | {
        result?: undefined;
    }>;
}
