import { ActionTypeComponent } from './ActionType'
<<<<<<< HEAD
import { AddAgent } from './AddAgent'
import { AgentManager } from './AgentManager'
import { AgentTextCompletion } from './AgentTextCompletion'
=======
import { AddAgent } from './agent/AddAgent'
import { AgentTextCompletion } from './agent/AgentTextCompletion'
import { AgentManager } from './agent/AgentManager'
>>>>>>> Start moving components around in folders for better organisation and visibility
import { Alert } from './AlertMessage'
import { ArchiveConversation } from './agent/ArchiveConversation'
import { ArrayVariable } from './ArrayVariable'
import { BooleanGate } from './BooleanGate'
import { BooleanVariable } from './BooleanVariable'
import { CacheManagerDelete } from './CacheManagerDelete'
import { CacheManagerGet } from './CacheManagerGet'
import { CacheManagerSet } from './CacheManagerSet'
import { Code } from './Code'
import { ConversationRecall } from './ConversationRecall'
import { ConversationStore } from './ConversationStore'
import { CreateOrGetAgent } from './CreateOrGetAgent'
// import { EnkiTask } from './EnkiTask'
import { InputFieldComponent } from './deprecated/InputField'
import { ModuleInput } from './deprecated/ModuleInput'
import { ModuleOutput } from './deprecated/ModuleOutput'
import { PlaytestInput } from './deprecated/PlaytestInput'
import { PlaytestPrint } from './deprecated/PlaytestPrint'
import { RunInputComponent } from './deprecated/RunInput'
import { DifficultyDetectorComponent } from './DifficultyDetector'
import { DocumentDelete } from './DocumentDelete'
import { DocumentGet } from './DocumentGet'
import { DocumentSet } from './DocumentSet'
import { Echo } from './Echo'
import { EntityDetector } from './EntityDetector'
import { FactsCount } from './FactsCount'
import { FactsRecall } from './FactsRecall'
import { FactsStore } from './FactsStore'
import { FastGreetingDetector } from './FastGreetingDetector'
import { FastProfanityDetector } from './FastProfanityDetector'
import { FastQuestionDetector } from './FastQuestionDetector'
import { ForEach } from './ForEach'
import { GenerateContext } from './GenerateContext'
import { Generator } from './Generator'
import { GetAgentData } from './GetAgentData'
import { GetAgentFacts } from './GetAgentFacts'
import { HuggingfaceComponent } from './Huggingface'
import { InputComponent } from './Input'
import { InputDestructureComponent } from './InputDestructure'
import { InputsToJSON } from './InputsToJSON'
import { IsNullOrUndefined } from './IsNullOrUndefined'
import { IsVariableTrue } from './IsVariableTrue'
import { ItemTypeComponent } from './ItemDetector'
import { JoinListComponent } from './JoinList'
import { KeywordExtractor } from './KeywordExtractor'
import { LogicalOperator } from './LogicalOperator'
import { MLGreetingDetector } from './MLGreetingDetector'
import { MLProfanityDetector } from './MLProfanityDetector'
import { MLQuestionDetector } from './MLQuestionDetector'
import { ModuleComponent } from './Module'
import { NamedEntityRecognition } from './NamedEntityRecognition'
import { NumberVariable } from './NumberVariable'
import { Output } from './Output'
import { ProseToScript } from './ProseToScript'
import { RandomGreetingResponse } from './RandomGreetingResponse'
import { RandomProfanityResponse } from './RandomProfanityResponse'
import { RandomStringFromList } from './RandomStringFromList'
import { SafetyVerifier } from './SafetyVerifier'
import { Search } from './Search'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
import { StringAdder } from './StringAdder'
import { StringCombiner } from './StringCombiner'
import { StringEvaluator } from './StringEvaluator'
import { StringProcessor } from './StringProcessor'
import { StringVariable } from './StringVariable'
import { SummarizeAndStoreFactsAboutAgent } from './SummarizeAndStoreFactsAboutAgent'
import { SummarizeAndStoreFactsAboutSpeaker } from './SummarizeAndStoreFactsAboutSpeaker'
import { SwitchGate } from './SwitchGate'
import { TenseTransformer } from './TenseTransformer'
import { TextToSpeech } from './TextToSpeech'
import { TimeDetectorComponent } from './TimeDetector'
import { TriggerIn } from './TriggerIn'
import { TriggerOut } from './TriggerOut'
import { WhileLoop } from './WhileLoop'

// Here we load up all components of the builder into our editor for usage.
// We might be able to programatically generate components from enki

// NOTE: PLEASE KEEP THESE IN ALPHABETICAL ORDER
// todo some kind of custom build parser perhaps to take car of keeping these in alphabetical order

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
  mlQuestionDetector: () => new MLQuestionDetector(),
  echo: () => new Echo(),
  summarizeAndStoreFactsAboutAgent: () =>
    new SummarizeAndStoreFactsAboutAgent(),
  summarizeAndStoreFactsAboutSpeaker: () =>
    new SummarizeAndStoreFactsAboutSpeaker(),
  textToSpeech: () => new TextToSpeech(),
  agentTextCompletion: () => new AgentTextCompletion(),
  agentManager: () => new AgentManager(),
  keywordExtractor: () => new KeywordExtractor(),
  namedEntityRecognition: () => new NamedEntityRecognition(),
  generateContext: () => new GenerateContext(),
  createOrGetAgent: () => new CreateOrGetAgent(),
  factsStore: () => new FactsStore(),
  factsRecall: () => new FactsRecall(),
  factsCount: () => new FactsCount(),
  getAgentData: () => new GetAgentData(),
  getAgentFacts: () => new GetAgentFacts(),
  isNullOrUndefined: () => new IsNullOrUndefined(),
  isVariableTrue: () => new IsVariableTrue(),
  conversationStore: () => new ConversationStore(),
  conversationRecall: () => new ConversationRecall(),
  search: () => new Search(),
  documentGet: () => new DocumentGet(),
  documentDelete: () => new DocumentDelete(),
  documentSet: () => new DocumentSet(),
  forEach: () => new ForEach(),
  whileLoop: () => new WhileLoop(),
  cacheManagerGet: () => new CacheManagerGet(),
  cacheManagerDelete: () => new CacheManagerDelete(),
  cacheManagerSet: () => new CacheManagerSet(),
  stringEvaluator: () => new StringEvaluator(),
  stringCombiner: () => new StringCombiner(),
  randomStringFromList: () => new RandomStringFromList(),
  randomGreetingResponse: () => new RandomGreetingResponse(),
  randomProfanityResponse: () => new RandomProfanityResponse(),
  stringVariable: () => new StringVariable(),
  stringAdder: () => new StringAdder(),
  numberVariable: () => new NumberVariable(),
  booleanVariable: () => new BooleanVariable(),
  arrayVariable: () => new ArrayVariable(),
  addAgent: () => new AddAgent(),
  logicalOperator: () => new LogicalOperator(),
  archiveConversation: () => new ArchiveConversation(),
  generator: () => new Generator(),
  huggingfaceComponent: () => new HuggingfaceComponent(),
  inputComponent: () => new InputComponent(),
  inputDestructureComponent: () => new InputDestructureComponent(),
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
}

export const getComponents = () => {
  return Object.values(components).map(component => component())
}
