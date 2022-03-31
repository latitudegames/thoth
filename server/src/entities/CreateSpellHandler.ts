import { creatorToolsDatabase } from '../databases/creatorTools';
import { Module } from '../routes/spells/module';
import { buildThothInterface, extractModuleInputKeys, extractNodes } from '../routes/spells/runSpell';
import { Graph, ModuleComponent } from '../routes/spells/types';
import { CustomError } from '../utils/CustomError';
import { ModuleType } from '@latitudegames/thoth-core/types';
import { initSharedEngine } from '@latitudegames/thoth-core/src/engine';
import { getComponents } from '@latitudegames/thoth-core/src/components/components';


export const CreateSpellHandler = async (props: { spell: any; version: string; }) => {
    // TODO: create a proper engine interface with the proper methods types on it.
    const engine = initSharedEngine({
        name: 'demo@0.1.0',
        components: getComponents(),
        server: true,
        modules: {},
    }) as any;

    let rootSpell;
    const { spell, version = 'latest' } = props;
    rootSpell = await creatorToolsDatabase.spells.findOne({
        where: { name: spell },
    });

    // eslint-disable-next-line functional/no-let
    let activeSpell;

    if (version === 'latest') {
        console.log('latest');
        activeSpell = rootSpell;
    } else {
        console.log('getting active spell');
        activeSpell = await creatorToolsDatabase.deployedSpells.findOne({
            where: { name: spell, version },
        });
    }

    //todo validate spell has an input trigger?
    if (!activeSpell?.graph) {
        throw new CustomError(
            'not-found',
            `Spell with name ${spell} and version ${version} not found`
        );
    }

    // TODO use test spells if body option is given
    // const activeSpell = getTestSpell(spell)
    const graph = activeSpell.graph as Graph;
    const modules = activeSpell.modules as Module[];

    const gameState = {
        ...rootSpell?.gameState
    };

    const thoth = buildThothInterface(null as any, gameState);

    // The module is an interface that the module system uses to write data to
    // used internally by the module plugin, and we make use of it here too.
    // TODO: Test runing nested modules and watch out for unexpected behaviour
    // when child modules overwrite this with their own.
    const module = new Module();
    // Parse array of modules into a map of modules by module name
    const moduleMap = modules?.reduce((modules: any, module: any) => {
        modules[module.name] = module;
        return modules;
    }, {} as Record<string, ModuleType>);
    // Update the modules available in the module manager during the graph run time
    engine.moduleManager.setModules(moduleMap);


    // ThothContext: map of services expected by Thoth components,
    // allowing client and server provide different sets of helpers that match the common interface
    // EngineContext passed down into the engine and is used by workers.
    const context = {
        module,
        thoth,
        silent: true,
    };
    // Engine process to set up the tasks and prime the system for the first 'run' command.
    await engine.process(graph, null, context);

    // Collect all the "trigger ins" that the module manager has gathered
    const triggerIns = engine.moduleManager.triggerIns;

    function getFirstNodeTrigger(data: Graph) {
        const extractedNodes = extractNodes(data.nodes, triggerIns);
        return extractedNodes[0];
    }

    // Standard default component to start the serverside run sequence from, which has the run function on it.
    const component = engine.components.get(
        'Module Trigger In'
    ) as ModuleComponent;


    // Defaulting to the first node trigger to start our "run"
    const triggeredNode = getFirstNodeTrigger(graph);

    const inputKeys = extractModuleInputKeys(graph) as string[];

    const runSpell = async (
        input: Record<string, any>,
        inputKeys: Record<string, any>,
        component: any,
        module: any,
        triggeredNode: any,
        graph: Graph) => {
        const formattedOutputs: Record<string, unknown> = {};
        let error = null;
        // Validates the body of the request against all expected values to ensure they are all present
        const inputs = inputKeys.reduce((inputs: any, expectedInput: string) => {
            const requestInput = input[expectedInput];
            if (requestInput) {
                inputs[expectedInput] = [requestInput];
                return inputs;
            } else {
                error = `Spell expects a value for ${expectedInput} to be provided `;
            }
        }, {} as Record<string, unknown>);
        // Eventual outputs of running the Spell
        const rawOutputs = {} as Record<string, unknown>;
        if (error)
            return rawOutputs;
        // Attaching inputs to the module, which are passed in when the engine runs.
        // you can see this at work in the 'workerInputs' function of module-manager
        // work inputs worker reads from the module inputs via the key in node.data.name
        // important to note: even single string values are wrapped in arrays due to match the client editor format
        module.read(inputs);

        await component.run(triggeredNode);

        // Write all the raw data that was output by the module run to an object
        module.write(rawOutputs);


        // Format raw outputs based on the names assigned to Module Outputs node data in the graph
        Object.values(graph.nodes)
            .filter((node: any) => {
                return node.name.includes('Output');
            })
            .forEach((node: any) => {
                formattedOutputs[(node as any).data.name as string] = rawOutputs[(node as any).data.socketKey as string];
            });
    };

    return async function (
        message: string | undefined,
        speaker: string,
        agent: string,
        client: string,
        channelId: string,
        entity: number
    ) {
        const response = await runSpell({
            Input: message,
            Speaker: speaker,
            Agent: agent,
            Client: client,
            ChannelID: channelId,
            Entity: entity,
        }, inputKeys, component, module, triggeredNode, graph);

        let index = undefined;

        for (const x in response) {
            index = x;
        }

        if (index && index !== undefined) {
            return response && response[index];
        } else {
            return undefined;
        }
    };
};
