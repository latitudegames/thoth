#!/usr/bin/env ts-node
import "regenerator-runtime/runtime";
import { Component } from "rete";
import spell from "./spell";
import { Module } from "./module";
import { EngineContext } from "../src/contexts/EditorProvider"
import { modules, components } from "./engine"
import { initSharedEngine } from "@latitudegames/thoth-core/engine";
interface ModuleComponent extends Component {
  run: Function;
}

// this parses through all the nodes in the data and finds the nodes associated with the given map
function extractNodes(nodes, map) {
  const names = Array.from(map.keys());

  return Object.keys(nodes)
    .filter((k) => names.includes(nodes[k].name))
    .map((k) => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1]);
}

// This will get the node that was triggered given a socketKey associated with that node.
function getTriggeredNode(data, socketKey, map) {
  return extractNodes(data.nodes, map).find(
    (node) => node.data.socketKey === socketKey
  );
}

// this will be the interface that we use to mirror any functionality from the client
// on the server. This completion function should make an actual openAI call.
const thoth: EngineContext = {
  completion: (body) => {
    return new Promise((resolve, reject) => { resolve("Joe looks around") })
  },
  getCurrentGameState: () => { },
  updateCurrentGameState: () => { }
};

const main = async () => {
  // only setting this as 'any' until we create a proper engine interface with the proper methods types on it.
  const engine = initSharedEngine("demo@0.1.0", modules, components, true) as any;

  // The module is an interface that the module system uses to write data to
  // used internally by the module plugin, and we make use of it here too.
  // we definitely want to watch out when we run nested modules to ensure nothing funky happens
  // when child modules overwrite this with their own.
  const module = new Module();

  // these map to the names of the module inputs that the user defined in their chains.
  // we would likely expect them to know what to use based on what they defined.
  // how can we type these?  Can we parse the spell chain for this information?
  const inputs = {
    text: "look around",
    name: "Joe",
  };

  // this will have the eventual outputs written to it
  const outputs = {};

  // this attaches inputs to the module, which is passed in when the engine runs.
  // you can see this at work in the 'workerInputs' function of module-manager
  module.read(inputs);

  // this is the context object which is passed down into the engine and is used by workers.
  const context = {
    module,
    thoth,
    silent: true,
  };

  // processing here with the engine will just set up the tasks and prime the system for the first 'run' command.
  // note that the thid
  await engine?.process(spell, null, context);

  // we grab all the "trigger ins" that the module manager has gathered for us.
  const triggerIns = engine.moduleManager.triggerIns;

  // We want to get a specific node that contains the socket we want to trigger to start our "run"
  // this could eventually be defined by a user as a param in their request body
  const triggeredNode = getTriggeredNode(
    spell,
    "1a819a65-e1e2-4f77-9a42-9f99f546f7c4",
    triggerIns
  );

  // Here we get the component that we want to start the run sequence from, since it is the component which has the run function on it.
  const component = engine?.components.get(
    "Module Trigger In"
  ) as ModuleComponent;

  // when we run the component, we need to pass to it WHICH node we are running from all the nodes that were built from it.
  await component?.run(triggeredNode);

  // when this is done, we write all the data that was output by the module run to an object
  module.write(outputs);

  console.log("Outputs", outputs);
};

main();
