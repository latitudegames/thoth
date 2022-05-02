import { NodesData } from 'rete/types/core/data';
import { ChainData } from '../../types';
/**
 * extracts all module inputs based upon a given key
 */
export declare const extractModuleInputKeys: (data: ChainData) => string[];
/**
 * Extracts nodes from a map of nodes
 */
export declare function extractNodes(nodes: NodesData, map: Set<unknown>): import("rete/types/core/data").NodeData[];
