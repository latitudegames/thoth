import { ThothReteComponent } from "./ThothReteComponent";
export declare class Generator extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, rawInputs: any, outputs: any, { thoth }: {
        thoth: any;
    }): Promise<{
        result: any;
        composed: string;
    }>;
}
