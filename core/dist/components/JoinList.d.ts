import { ThothReteComponent } from "./ThothReteComponent";
export declare class JoinListComponent extends ThothReteComponent {
    constructor();
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any): Promise<{
        text: any;
    }>;
}
