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
import { FormOpinionAboutSpeaker } from './FormOpinionAboutSpeaker'
import { Generator } from './Generator'
import { HuggingfaceComponent } from './Huggingface'
import { InputComponent } from './Input'
import { InputsToJSON } from './InputsToJSON'
import { ItemTypeComponent } from './ItemDetector'
import { JoinListComponent } from './JoinList'
import { LogicalOperator } from './LogicalOperator'
import { MLGreetingDetector } from './MLGreetingDetector'
import { MLProfanityDetector } from './MLProfanityDetector'
import { ModuleComponent } from './Module'
import { OpinionAboutSpeakerGet } from './OpinionAboutSpeakerGet'
import { OpinionAboutSpeakerSet } from './OpinionAboutSpeakerSet'
import { Output } from './Output'
import { ProseToScript } from './ProseToScript'
import { RandomStringFromList } from './RandomStringFromList'
import { SafetyVerifier } from './SafetyVerifier'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
import { StringCombiner } from './StringCombiner'
import { StringEvaluator } from './StringEvaluator'
import { StringProcessor } from './StringProcessor'
import { SummarizeAndStoreFactsAboutAgent } from './SummarizeAndStoreFactsAboutAgent'
import { SummarizeAndStoreFactsAboutSpeaker } from './SummarizeAndStoreFactsAboutSpeaker'
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
  fastQuestionDetector: () => new FastQuestionDetector(),
  fastGreetingDetector: () => new FastGreetingDetector(),
  fastProfanityDetector: () => new FastProfanityDetector(),
  mlGreetingDetector: () => new MLGreetingDetector(),
  mlProfanityDetector: () => new MLProfanityDetector(),
  summarizeAndStoreFactsAboutAgent: () =>
    new SummarizeAndStoreFactsAboutAgent(),
  summarizeAndStoreFactsAboutSpeaker: () =>
    new SummarizeAndStoreFactsAboutSpeaker(),
  factsStore: () => new FactsStore(),
  factsRecall: () => new FactsRecall(),
  factsCount: () => new FactsCount(),
  conversationStore: () => new ConversationStore(),
  conversationRecall: () => new ConversationRecall(),
  conversationCount: () => new ConversationCount(),
  formOpinionAboutSpeaker: () => new FormOpinionAboutSpeaker(),
  opinionAboutSpeakerSet: () => new OpinionAboutSpeakerSet(),
  opinionAboutSpeakerGet: () => new OpinionAboutSpeakerGet(),
  forEach: () => new ForEach(),
  stringEvaluator: () => new StringEvaluator(),
  stringCombiner: () => new StringCombiner(),
  randomStringFromList: () => new RandomStringFromList(),
  logicalOperator: () => new LogicalOperator(),
  archiveConversation: () => new ArchiveConversation(),
  generator: () => new Generator(),
  huggingfaceComponent: () => new HuggingfaceComponent(),
  inputComponent: () => new InputComponent(),
  inputFieldComponent: () => new InputFieldComponent(),
  inputsToJson: () => new InputsToJSON(),
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
