import { ActionTypeComponent } from "./ActionType";
import { Alert } from "./AlertMessage";
import { BooleanGate } from "./BooleanGate";
import { Code } from "./Code";
import { DifficultyDetectorComponent } from "./DifficultyDetector";
import { EnkiTask } from "./EnkiTask";
import { EntityDetector } from "./EntityDetector";
import { ForEach } from "./ForEach";
import { Generator } from "./Generator";
import { HuggingfaceComponent } from "./Huggingface";
import { InputComponent } from "./Input";
import { ItemTypeComponent } from "./ItemDetector";
import { JoinListComponent } from "./JoinList";
import { ModuleComponent } from "./Module";
import { ModuleInput } from "./ModuleInput";
import { ModuleOutput } from "./ModuleOutput";
import { ModuleTriggerIn } from "./ModuleTriggerIn";
import { ModuleTriggerOut } from "./ModuleTriggerOut";
import { PlaytestInput } from "./PlaytestInput";
import { PlaytestPrint } from "./PlaytestPrint";
import { ProseToScript } from "./ProseToScript";
import { RunInputComponent } from "./RunInput";
import { SafetyVerifier } from "./SafetyVerifier";
import { StateRead } from "./StateRead";
import { StateWrite } from "./StateWrite";
import { StringProcessor } from "./StringProcessor";
import { SwitchGate } from "./SwitchGate";
import { TenseTransformer } from "./TenseTransformer";
import { TimeDetectorComponent } from "./TimeDetector";

// Here we load up all components of the builder into our editor for usage.
// We might be able to programatically generate components from enki

export const components = [
  new ActionTypeComponent(),
  new Alert(),
  new BooleanGate(),
  new Code(),
  new DifficultyDetectorComponent(),
  new EnkiTask(),
  new EntityDetector(),
  new ForEach(),
  new Generator(),
  new HuggingfaceComponent(),
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
  new ProseToScript(),
];