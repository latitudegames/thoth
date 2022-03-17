import { ActionTypeComponent } from './ActionType'
import { AddAgent } from './agent/AddAgent'
import { AgentManager } from './agent/AgentManager'
import { AgentTextCompletion } from './agent/AgentTextCompletion'
import { ArchiveConversation } from './agent/ArchiveConversation'
import { CacheManagerDelete } from './agent/CacheManagerDelete'
import { CacheManagerGet } from './agent/CacheManagerGet'
import { CacheManagerSet } from './agent/CacheManagerSet'
import { ChatClassification } from './agent/ChatClassification'
import { ConversationRecall } from './agent/ConversationRecall'
import { ConversationStore } from './agent/ConversationStore'
import { CreateOrGetAgent } from './agent/CreateOrGetAgent'
import { DocumentDelete } from './agent/DocumentDelete'
import { DocumentGet } from './agent/DocumentGet'
import { DocumentSet } from './agent/DocumentSet'
import { Echo } from './agent/Echo'
import { FactsCount } from './agent/FactsCount'
import { FactsRecall } from './agent/FactsRecall'
import { FactsStore } from './agent/FactsStore'
import { FastGreetingDetector } from './agent/FastGreetingDetector'
import { FastProfanityDetector } from './agent/FastProfanityDetector'
import { FastQuestionDetector } from './agent/FastQuestionDetector'
import { FewshotVariable } from './agent/FewshotVariable'
import { GenerateContext } from './agent/GenerateContext'
import { GetAgentData } from './agent/GetAgentData'
import { GetAgentFacts } from './agent/GetAgentFacts'
import { InputClassification } from './agent/InputClassification'
import { InputDestructureComponent } from './agent/InputDestructure'
import { InputsToJSON } from './agent/InputsToJSON'
import { IsNullOrUndefined } from './agent/IsNullOrUndefined'
import { IsVariableTrue } from './agent/IsVariableTrue'
import { KeywordExtractor } from './agent/KeywordExtractor'
import { LogicalOperator } from './agent/LogicalOperator'
import { MLGreetingDetector } from './agent/MLGreetingDetector'
import { MLProfanityDetector } from './agent/MLProfanityDetector'
import { MLQuestionDetector } from './agent/MLQuestionDetector'
import { NamedEntityRecognition } from './agent/NamedEntityRecognition'
import { NumberVariable } from './agent/NumberVariable'
import { RandomGreetingResponse } from './agent/RandomGreetingResponse'
import { RandomProfanityResponse } from './agent/RandomProfanityResponse'
import { RandomStringFromList } from './agent/RandomStringFromList'
import { Search } from './agent/Search'
import { StringAdder } from './agent/StringAdder'
import { StringCombiner } from './agent/StringCombiner'
import { StringEvaluator } from './agent/StringEvaluator'
import { StringProcessor } from './agent/StringProcessor'
import { StringVariable } from './agent/StringVariable'
import { SummarizeAndStoreFactsAboutAgent } from './agent/SummarizeAndStoreFactsAboutAgent'
import { SummarizeAndStoreFactsAboutSpeaker } from './agent/SummarizeAndStoreFactsAboutSpeaker'
import { Alert } from './AlertMessage'
import { ArrayVariable } from './ArrayVariable'
import { BooleanGate } from './BooleanGate'
import { BooleanVariable } from './BooleanVariable'
import { Code } from './Code'
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
import { HuggingfaceComponent } from './Huggingface'
import { InputComponent } from './Input'
import { ItemTypeComponent } from './ItemDetector'
import { JoinListComponent } from './JoinList'
import { ModuleComponent } from './Module'
import { Output } from './Output'
import { ProseToScript } from './ProseToScript'
import { SafetyVerifier } from './SafetyVerifier'
import { StateRead } from './StateRead'
import { StateWrite } from './StateWrite'
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
  chatClassification: () => new ChatClassification(),
  inputClassification: () => new InputClassification(),
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
  fewshotVariable: () => new FewshotVariable(),
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
