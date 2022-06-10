import { ActionTypeComponent } from './deprecated/ActionType'
import { Alert } from './utility/AlertMessage'
import { BooleanGate } from './BooleanGate'
import { InRange } from './InRange'
import { Code } from './Code'
import { InputFieldComponent } from './deprecated/InputField'
import { ModuleInput } from './deprecated/ModuleInput'
import { ModuleOutput } from './deprecated/ModuleOutput'
import { PlaytestInput } from './deprecated/PlaytestInput'
import { PlaytestPrint } from './deprecated/PlaytestPrint'
import { RunInputComponent } from './deprecated/RunInput'
import { DifficultyDetectorComponent } from './DifficultyDetector'
import { EnkiTask } from './EnkiTask'
import { EntityDetector } from './deprecated/EntityDetector'
import { ForEach } from './deprecated/ForEach'
import { Generator } from './Generator'
import { HuggingfaceComponent } from './Huggingface'
import { InputComponent } from './Input'
import { ItemTypeComponent } from './deprecated/ItemDetector'
import { JoinListComponent } from './JoinList'
import { Output } from './Output'
import { ProseToScript } from './deprecated/ProseToScript'
import { SafetyVerifier } from './deprecated/SafetyVerifier'
import { SpellComponent } from './Spell'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
import { StringProcessor } from './StringProcessor'
import { SwitchGate } from './SwitchGate'
import { TenseTransformer } from './deprecated/TenseTransformer'
import { TimeDetectorComponent } from './deprecated/TimeDetector'
import { TriggerIn } from './TriggerIn'
import { TriggerOut } from './TriggerOut'
import { VisualGeneration } from './VisualGeneration'
import { Echo } from './utility/Echo'

// Here we load up all components of the builder into our editor for usage.
// We might be able to programatically generate components from enki

export const components = {
  actionTypeComponent: () => new ActionTypeComponent(),
  alert: () => new Alert(),
  booleanGate: () => new BooleanGate(),
  inRange: () => new InRange(),
  code: () => new Code(),
  difficultyDetectorComponent: () => new DifficultyDetectorComponent(),
  echoComponent: () => new Echo(),
  enkiTask: () => new EnkiTask(),
  entityDetector: () => new EntityDetector(),
  forEach: () => new ForEach(),
  generator: () => new Generator(),
  huggingfaceComponent: () => new HuggingfaceComponent(),
  inputComponent: () => new InputComponent(),
  inputFieldComponent: () => new InputFieldComponent(),
  itemTypeComponent: () => new ItemTypeComponent(),
  joinListComponent: () => new JoinListComponent(),
  moduleComponent: () => new SpellComponent(),
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
  TriggerIn: () => new TriggerIn(),
  triggerOut: () => new TriggerOut(),
  VisualGeneration: () => new VisualGeneration(),
}

export const getComponents = () => {
  return Object.values(components).map(component => component())
}
