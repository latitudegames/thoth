#!/usr/bin/env ts-node
import "regenerator-runtime/runtime";
import Rete from "rete";

import spell from "./spell";

import TaskPlugin from "../src/features/rete/plugins/taskPlugin";
import ModulePlugin from "../src/features/rete/plugins/modulePlugin";

import { InputComponent } from "../src/features/rete/components/Input";
import { JoinListComponent } from "../src/features/rete/components/JoinList";
import { TenseTransformer } from "../src/features/rete/components/TenseTransformer";
import { RunInputComponent } from "../src/features/rete/components/RunInput";
import { ActionTypeComponent } from "../src/features/rete/components/ActionType";
import { ItemTypeComponent } from "../src/features/rete/components/ItemDetector";
import { DifficultyDetectorComponent } from "../src/features/rete/components/DifficultyDetector";
import { EntityDetector } from "../src/features/rete/components/EntityDetector";
import { SafetyVerifier } from "../src/features/rete/components/SafetyVerifier";
import { BooleanGate } from "../src/features/rete/components/BooleanGate";
import { TimeDetectorComponent } from "../src/features/rete/components/TimeDetector";
import { Alert } from "../src/features/rete/components/AlertMessage";
import { SwitchGate } from "../src/features/rete/components/SwitchGate";
import { PlaytestPrint } from "../src/features/rete/components/PlaytestPrint";
import { PlaytestInput } from "../src/features/rete/components/PlaytestInput";
import { StateWrite } from "../src/features/rete/components/StateWrite";
import { StateRead } from "../src/features/rete/components/StateRead";
import { StringProcessor } from "../src/features/rete/components/StringProcessor";
import { ForEach } from "../src/features/rete/components/ForEach";
import { EnkiTask } from "../src/features/rete/components/EnkiTask";
import { Generator } from "../src/features/rete/components/Generator";
import { Code } from "../src/features/rete/components/Code";
import { ModuleComponent } from "../src/features/rete/components/Module";
import { ModuleInput } from "../src/features/rete/components/ModuleInput";
import { ModuleOutput } from "../src/features/rete/components/ModuleOutput";
import { ModuleTriggerOut } from "../src/features/rete/components/ModuleTriggerOut";
import { ModuleTriggerIn } from "../src/features/rete/components/ModuleTriggerIn";

const components = [
  new ActionTypeComponent(),
  new Alert(),
  new BooleanGate(),
  new Code(),
  new DifficultyDetectorComponent(),
  new EnkiTask(),
  new EntityDetector(),
  new ForEach(),
  new Generator(),
  new InputComponent(),
  new ItemTypeComponent(),
  new JoinListComponent(),
  new ModuleComponent(),
  new ModuleInput(),
  new ModuleOutput(),
  new ModuleTriggerOut(),
  new ModuleTriggerIn(),
  new PlaytestPrint(),
  new PlaytestInput(),
  new RunInputComponent(),
  new SafetyVerifier(),
  new StateWrite(),
  new StateRead(),
  new StringProcessor(),
  new SwitchGate(),
  new TenseTransformer(),
  new TimeDetectorComponent(),
];

let modules = [];
const engine = new Rete.Engine("demo@0.1.0");

engine.use(ModulePlugin, { engine, modules });
engine.use(TaskPlugin);

engine.bind("run");

components.forEach((c) => {
  engine.register(c);
});

console.log("spell", spell);
