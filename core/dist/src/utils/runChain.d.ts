import { EngineContext, ChainData, Subspell } from '../../types';
import { ThothEngine } from '../engine';
declare type RunChainArguments = {
    graph: ChainData;
    inputs: Record<string, unknown[]>;
    thoth: EngineContext;
    engine: ThothEngine;
    subspells?: Subspell[];
};
export declare const runChain: ({ graph, inputs, thoth, engine, subspells, }: RunChainArguments) => Promise<Record<string, unknown>>;
export {};
