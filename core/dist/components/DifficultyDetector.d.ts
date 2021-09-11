import { ThothReteComponent } from "./ThothReteComponent";
export declare class DifficultyDetectorComponent extends ThothReteComponent {
    constructor();
    displayControl: {};
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any, { silent, thoth }: {
        silent: any;
        thoth: any;
    }): Promise<{
        difficulty: any;
        category: any;
    }>;
}
