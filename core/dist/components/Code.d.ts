import { ThothReteComponent } from "./ThothReteComponent";
export declare class Code extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any, { silent, data }: {
        silent: any;
        data: any;
    }): Promise<any>;
}
