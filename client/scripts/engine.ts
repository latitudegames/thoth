// import spell from "./spell";

import { TenseTransformer } from "@thoth/core/components/TenseTransformer";
import { ModuleInput } from "@thoth/core/components/ModuleInput";
import { ModuleOutput } from "@thoth/core/components/ModuleOutput";
import { ModuleTriggerOut } from "@thoth/core/components/ModuleTriggerOut";
import { ModuleTriggerIn } from "@thoth/core/components/ModuleTriggerIn";
// import { InputComponent } from "@thoth/core/components/Input";
// import { JoinListComponent } from "@thoth/core/components/JoinList";
// import { RunInputComponent } from "@thoth/core/components/RunInput";
// import { ActionTypeComponent } from "@thoth/core/components/ActionType";
// import { ItemTypeComponent } from "@thoth/core/components/ItemDetector";
// import { DifficultyDetectorComponent } from "@thoth/core/components/DifficultyDetector";
// import { EntityDetector } from "@thoth/core/components/EntityDetector";
// import { SafetyVerifier } from "@thoth/core/components/SafetyVerifier";
// import { BooleanGate } from "@thoth/core/components/BooleanGate";
// import { TimeDetectorComponent } from "@thoth/core/components/TimeDetector";
// import { Alert } from "@thoth/core/components/AlertMessage";
// import { SwitchGate } from "@thoth/core/components/SwitchGate";
// import { PlaytestPrint } from "@thoth/core/components/PlaytestPrint";
// import { PlaytestInput } from "@thoth/core/components/PlaytestInput";
// import { StateWrite } from "@thoth/core/components/StateWrite";
// import { StateRead } from "@thoth/core/components/StateRead";
// import { StringProcessor } from "@thoth/core/components/StringProcessor";
// import { ForEach } from "@thoth/core/components/ForEach";
// import { EnkiTask } from "@thoth/core/components/EnkiTask";
// import { Generator } from "@thoth/core/components/Generator";
// import { Code } from "@thoth/core/components/Code";
// import { ModuleComponent } from "@thoth/core/components/Module";

export const components = [
  // new ActionTypeComponent(),
  // new Alert(),
  // new BooleanGate(),
  // new Code(),
  // new DifficultyDetectorComponent(),
  // new EnkiTask(),
  // new EntityDetector(),
  // new ForEach(),
  // new Generator(),
  // new InputComponent(),
  // new ItemTypeComponent(),
  // new JoinListComponent(),
  // new ModuleComponent(),
  new ModuleInput(),
  new ModuleOutput(),
  new ModuleTriggerOut(),
  new ModuleTriggerIn(),
  // new PlaytestPrint(),
  // new PlaytestInput(),
  // new RunInputComponent(),
  // new SafetyVerifier(),
  // new StateWrite(),
  // new StateRead(),
  // new StringProcessor(),
  // new SwitchGate(),
  new TenseTransformer(),
  // new TimeDetectorComponent(),
];

export let modules = [];
