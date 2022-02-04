import { ActionTypeComponent } from './ActionType'
import { Alert } from './AlertMessage'
import { BooleanGate } from './BooleanGate'
import { Code } from './Code'
// import { EnkiTask } from './EnkiTask'
// import { HuggingfaceComponent } from './Huggingface'
import { InputFieldComponent } from './deprecated/InputField'
import { ModuleInput } from './deprecated/ModuleInput'
import { ModuleOutput } from './deprecated/ModuleOutput'
import { PlaytestInput } from './deprecated/PlaytestInput'
import { PlaytestPrint } from './deprecated/PlaytestPrint'
import { RunInputComponent } from './deprecated/RunInput'
import { DifficultyDetectorComponent } from './DifficultyDetector'
import { EntityDetector } from './EntityDetector'
import { ForEach } from './ForEach'
import { Generator } from './Generator'
import { InputComponent } from './Input'
import { ItemTypeComponent } from './ItemDetector'
import { JoinListComponent } from './JoinList'
import { ModuleComponent } from './Module'
import { Output } from './Output'
import { ProseToScript } from './ProseToScript'
import { SafetyVerifier } from './SafetyVerifier'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
import { StringProcessor } from './StringProcessor'
import { SwitchGate } from './SwitchGate'
import { TenseTransformer } from './TenseTransformer'
import { TimeDetectorComponent } from './TimeDetector'
import { TriggerIn } from './TriggerIn'
import { TriggerOut } from './TriggerOut'
import { VisualGeneration } from './VisualGeneration'

// Here we load up all components of the builder into our editor for usage.
// We might be able to programatically generate components from enki

export const components = {
  actionTypeComponent: () => new ActionTypeComponent(),
  alert: () => new Alert(),
  booleanGate: () => new BooleanGate(),
  code: () => new Code(),
  difficultyDetectorComponent: () => new DifficultyDetectorComponent(),
  // enkiTask: () => new EnkiTask(),
  entityDetector: () => new EntityDetector(),
  forEach: () => new ForEach(),
  generator: () => new Generator(),
  // huggingfaceComponent: () => new HuggingfaceComponent(),
  inputComponent: () => new InputComponent(),
  inputFieldComponent: () => new InputFieldComponent(),
  itemTypeComponent: () => new ItemTypeComponent(),
  joinListComponent: () => new JoinListComponent(),
  moduleComponent: () => new ModuleComponent(),
  moduleInput: () => new ModuleInput(),
  moduleOutput: () => new ModuleOutput(),
  output: () => new Output(),
  playtestPrint: () => new PlaytestPrint(),
  playtestInput: () => new PlaytestInput(),
  proseToScript: () => new ProseToScript(),
  runInputCompnent: () => new RunInputComponent(),
  safetyVerifier: () => new SafetyVerifier(),
  stateWrite: () => new StateWrite(),
  stateRead: () => new StateRead(),
  stringProcessor: () => new StringProcessor(),
  switchGate: () => new SwitchGate(),
  tenseTransformer: () => new TenseTransformer(),
  timeDetectorComponent: () => new TimeDetectorComponent(),
  triggerIn: () => new TriggerIn(),
  triggerOut: () => new TriggerOut(),
  VisualGeneration: () => new VisualGeneration(),
}

export const getComponents = () => {
  return Object.values(components).map(component => component())
}
