import { ActionTypeComponent } from './ActionType'
import { Alert } from './AlertMessage'
import { BooleanGate } from './BooleanGate'
import { Code } from './Code'
import { DifficultyDetectorComponent } from './DifficultyDetector'
import { EnkiTask } from './EnkiTask'
import { EntityDetector } from './EntityDetector'
import { ForEach } from './ForEach'
import { Generator } from './Generator'
import { HuggingfaceComponent } from './Huggingface'
import { InputComponent } from './Input'
import { InputFieldComponent } from './InputField'
import { ItemTypeComponent } from './ItemDetector'
import { JoinListComponent } from './JoinList'
import { ModuleComponent } from './Module'
import { ModuleInput } from './ModuleInput'
import { ModuleOutput } from './ModuleOutput'
import { ModuleTriggerIn } from './ModuleTriggerIn'
import { ModuleTriggerOut } from './ModuleTriggerOut'
import { PlaytestInput } from './PlaytestInput'
import { PlaytestPrint } from './PlaytestPrint'
import { ProseToScript } from './ProseToScript'
import { RunInputComponent } from './RunInput'
import { SafetyVerifier } from './SafetyVerifier'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
import { StringProcessor } from './StringProcessor'
import { SwitchGate } from './SwitchGate'
import { TenseTransformer } from './TenseTransformer'
import { TimeDetectorComponent } from './TimeDetector'

// Here we load up all components of the builder into our editor for usage.
// We might be able to programatically generate components from enki

export const components = {
  actionTypeComponent: () => new ActionTypeComponent(),
  alert: () => new Alert(),
  booleanGate: () => new BooleanGate(),
  code: () => new Code(),
  difficultyDetectorComponent: () => new DifficultyDetectorComponent(),
  enkiTask: () => new EnkiTask(),
  entityDetector: () => new EntityDetector(),
  forEach: () => new ForEach(),
  generator: () => new Generator(),
  huggingfaceComponent: () => new HuggingfaceComponent(),
  inputComponent: () => new InputComponent(),
  inputFieldComponent: () => new InputFieldComponent(),
  itemTypeComponent: () => new ItemTypeComponent(),
  joinListComponent: () => new JoinListComponent(),
  moduleComponent: () => new ModuleComponent(),
  moduleInput: () => new ModuleInput(),
  moduleOutput: () => new ModuleOutput(),
  moduleTriggerOut: () => new ModuleTriggerOut(),
  moduleTriggerIn: () => new ModuleTriggerIn(),
  playtestPrint: () => new PlaytestPrint(),
  playtestInput: () => new PlaytestInput(),
  runInputCompnent: () => new RunInputComponent(),
  safetyVerifier: () => new SafetyVerifier(),
  stateWrite: () => new StateWrite(),
  stateRead: () => new StateRead(),
  stringProcessor: () => new StringProcessor(),
  switchGate: () => new SwitchGate(),
  tenseTransformer: () => new TenseTransformer(),
  timeDetectorComponent: () => new TimeDetectorComponent(),
  proseToScript: () => new ProseToScript(),
}

export const getComponents = () => {
  return Object.values(components).map(component => component())
}
