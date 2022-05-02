import { ImageCacheResponse, NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class VisualGeneration extends ThothComponent<Promise<ImageCacheResponse>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<ImageCacheResponse>;
}
