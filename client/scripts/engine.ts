// import spell from "./spell";

import { TenseTransformer } from "@latitudegames/thoth-core/components/TenseTransformer";
import { ModuleInput } from "@latitudegames/thoth-core/components/ModuleInput";
import { ModuleOutput } from "@latitudegames/thoth-core/components/ModuleOutput";
import { ModuleTriggerOut } from "@latitudegames/thoth-core/components/ModuleTriggerOut";
import { ModuleTriggerIn } from "@latitudegames/thoth-core/components/ModuleTriggerIn";
// import { InputComponent } from "@latitudegames/thoth-core/components/Input";
// import { JoinListComponent } from "@latitudegames/thoth-core/components/JoinList";
// import { RunInputComponent } from "@latitudegames/thoth-core/components/RunInput";
// import { ActionTypeComponent } from "@latitudegames/thoth-core/components/ActionType";
// import { ItemTypeComponent } from "@latitudegames/thoth-core/components/ItemDetector";
// import { DifficultyDetectorComponent } from "@latitudegames/thoth-core/components/DifficultyDetector";
// import { EntityDetector } from "@latitudegames/thoth-core/components/EntityDetector";
// import { SafetyVerifier } from "@latitudegames/thoth-core/components/SafetyVerifier";
// import { BooleanGate } from "@latitudegames/thoth-core/components/BooleanGate";
// import { TimeDetectorComponent } from "@latitudegames/thoth-core/components/TimeDetector";
// import { Alert } from "@latitudegames/thoth-core/components/AlertMessage";
// import { SwitchGate } from "@latitudegames/thoth-core/components/SwitchGate";
// import { PlaytestPrint } from "@latitudegames/thoth-core/components/PlaytestPrint";
// import { PlaytestInput } from "@latitudegames/thoth-core/components/PlaytestInput";
// import { StateWrite } from "@latitudegames/thoth-core/components/StateWrite";
// import { StateRead } from "@latitudegames/thoth-core/components/StateRead";
// import { StringProcessor } from "@latitudegames/thoth-core/components/StringProcessor";
// import { ForEach } from "@latitudegames/thoth-core/components/ForEach";
// import { EnkiTask } from "@latitudegames/thoth-core/components/EnkiTask";
// import { Generator } from "@latitudegames/thoth-core/components/Generator";
// import { Code } from "@latitudegames/thoth-core/components/Code";
// import { ModuleComponent } from "@latitudegames/thoth-core/components/Module";

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
