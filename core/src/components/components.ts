import { ActionTypeComponent } from './ActionType'
import { Alert } from './AlertMessage'
import { ArchiveConversation } from './ArchiveConversation'
import { BooleanGate } from './BooleanGate'
import { Code } from './Code'
import { ConversationCount } from './ConversationCount'
import { ConversationRecall } from './ConversationRecall'
import { ConversationStore } from './ConversationStore'
// import { EnkiTask } from './EnkiTask'
import { InputFieldComponent } from './deprecated/InputField'
import { ModuleInput } from './deprecated/ModuleInput'
import { ModuleOutput } from './deprecated/ModuleOutput'
import { PlaytestInput } from './deprecated/PlaytestInput'
import { PlaytestPrint } from './deprecated/PlaytestPrint'
import { RunInputComponent } from './deprecated/RunInput'
import { DifficultyDetectorComponent } from './DifficultyDetector'
import { EntityDetector } from './EntityDetector'
import { FactsCount } from './FactsCount'
import { FactsRecall } from './FactsRecall'
import { FactsStore } from './FactsStore'
import { FastGreetingDetector } from './FastGreetingDetector'
import { FastProfanityDetector } from './FastProfanityDetector'
import { FastQuestionDetector } from './FastQuestionDetector'
import { ForEach } from './ForEach'
import { Generator } from './Generator'
import { HuggingfaceComponent } from './Huggingface'
import { InputComponent } from './Input'
import { ItemTypeComponent } from './ItemDetector'
import { JoinListComponent } from './JoinList'
import { MLGreetingDetector } from './MLGreetingDetector'
import { MLProfanityDetector } from './MLProfanityDetector'
import { ModuleComponent } from './Module'
import { Output } from './Output'
import { ProseToScript } from './ProseToScript'
import { SafetyVerifier } from './SafetyVerifier'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
import { StringCombiner } from './StringCombiner'
import { StringEvaluator } from './StringEvaluator'
import { StringProcessor } from './StringProcessor'
import { SwitchGate } from './SwitchGate'
import { TenseTransformer } from './TenseTransformer'
import { TimeDetectorComponent } from './TimeDetector'
import { TriggerIn } from './TriggerIn'
import { TriggerOut } from './TriggerOut'

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
  fastQuestionDetector: () => new FastQuestionDetector(),
  fastGreetingDetector: () => new FastGreetingDetector(),
  fastProfanityDetector: () => new FastProfanityDetector(),
  mlGreetingDetector: () => new MLGreetingDetector(),
  mlProfanityDetector: () => new MLProfanityDetector(),
  factsStore: () => new FactsStore(),
  factsRecall: () => new FactsRecall(),
  factsCount: () => new FactsCount(),
  conversationStore: () => new ConversationStore(),
  conversationRecall: () => new ConversationRecall(),
  conversationCount: () => new ConversationCount(),
  forEach: () => new ForEach(),
  stringEvaluator: () => new StringEvaluator(),
  stringCombiner: () => new StringCombiner(),
  archiveConversation: () => new ArchiveConversation(),
  generator: () => new Generator(),
  huggingfaceComponent: () => new HuggingfaceComponent(),
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
}

export const getComponents = () => {
  return Object.values(components).map(component => component())
}
