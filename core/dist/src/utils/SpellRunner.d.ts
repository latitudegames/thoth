import { EngineContext, Spell as SpellType } from '../../types';
import { ThothEngine } from '../engine';
import { Module } from '../plugins/modulePlugin/module';
declare type RunSpellConstructor = {
    thothInterface: EngineContext;
};
declare class SpellRunner {
    engine: ThothEngine;
    currentSpell: SpellType;
    module: Module;
    thothInterface: EngineContext;
    ranSpells: string[];
    constructor({ thothInterface }: RunSpellConstructor);
    /**
     * Getter method for the triggers ins for the loaded spell
     */
    get triggerIns(): any;
    /**
     * Getter method which returns the run context for the current spell.
     */
    get context(): {
        module: Module;
        thoth: EngineContext;
        silent: boolean;
    };
    /**
     * Getter method to return all of the inputs keys of a given spell from the spells inputs
     */
    get inputKeys(): string[];
    /**
     * Getter method to return a formatted set of outputs of the most recent spell run.
     */
    get outputData(): Record<string, unknown>;
    /**
     * Clears the cache of spells which the runner has ran.
     */
    private _clearRanSpellCache;
    /**
     * Used to format inputs into the format the moduel runner expects.
     * Takes a normal object of type { key: value } and returns an object
     * of shape { key: [value]}.  This shape isa required when running the spell
     * since that is the shape that rete inputs take when processing the graph.
     */
    private _formatInputs;
    /**
     * Gewts a single component from the engine by name.
     */
    private _getComponent;
    /**
     * Takes a dictionary of inputs, converts them to the module format required
     * and puts those values into the module in preparation for processing.
     */
    private _loadInputs;
    /**
     * Takes the set of raw outputs, which makes use of the socket key,
     * and swaps the socket key for the socket name for human readable outputs.
     */
    private _formatOutputs;
    /**
     * temporary method until we have a better way to target specific nodes
     * this is basically just using a "Default" trigger in
     * and does not support multipel triggers in to a spell yet
     */
    private _getFirstNodeTrigger;
    /**
     * Resets all tasks.  This clears the cached data output of the task and prepares
     * it for the next run.
     */
    private _resetTasks;
    /**
     * Runs engine process to load the spell into the engine.
     */
    private _process;
    /**
     * Loads a spell into the spell runner.
     */
    loadSpell(spell: SpellType): Promise<void>;
    /**
     * Main spell runner for now. Processes inputs, gets the right component that starts the
     * running.  Would be even better iof we just took a node identifier, got its
     * component, and ran the one triggered rather than this slightly hacky hard coded
     * method.
     */
    runComponent(inputs: Record<string, any>, componentName: string, runSubspell?: boolean): Promise<Record<string, unknown>>;
    /**
     * temporary function to be backwards compatible with current use of run spell
     */
    defaultRun(inputs: Record<string, any>, runSubspell?: boolean): Promise<Record<string, unknown>>;
}
export default SpellRunner;
