import { AddAgent } from './agent/AddAgent'
import { AgentManager } from './agent/AgentManager'
import { AgentTextCompletion } from './agent/AgentTextCompletion'
import { ArchiveConversation } from './agent/ArchiveConversation'
import { CacheManagerDelete } from './agent/CacheManagerDelete'
import { CacheManagerGet } from './agent/CacheManagerGet'
import { CacheManagerSet } from './agent/CacheManagerSet'
import { ConversationRecall } from './agent/ConversationRecall'
import { ConversationStore } from './agent/ConversationStore'
import { CreateOrGetAgent } from './agent/CreateOrGetAgent'
import { FactsCount } from './agent/FactsCount'
import { FactsRecall } from './agent/FactsRecall'
import { FactsStore } from './agent/FactsStore'
import { GenerateContext } from './agent/GenerateContext'
import { GetAgentData } from './agent/GetAgentData'
import { GetAgentFacts } from './agent/GetAgentFacts'
import { InputDestructureComponent } from './agent/InputDestructure'
import { InputsToJSON } from './agent/InputsToJSON'
import { RandomGreetingResponse } from './agent/RandomGreetingResponse'
import { RandomProfanityResponse } from './agent/RandomProfanityResponse'
import { InputComponent } from './io/Input'
import { ModuleComponent } from './io/Module'
import { Output } from './io/Output'
import { TriggerIn } from './io/TriggerIn'
import { TriggerOut } from './io/TriggerOut'
import { BooleanGate } from './logic/BooleanGate'
import { Code } from './logic/Code'
import { ForEach } from './logic/ForEach'
import { IsNullOrUndefined } from './logic/IsNullOrUndefined'
import { IsVariableTrue } from './logic/IsVariableTrue'
import { LogicalOperator } from './logic/LogicalOperator'
import { SwitchGate } from './logic/SwitchGate'
import { WhileLoop } from './logic/WhileLoop'
import { ActionTypeComponent } from './ml/ActionType'
import { Classifier } from './ml/Classifier'
import { DifficultyDetectorComponent } from './ml/DifficultyDetector'
import { EntityDetector } from './ml/EntityDetector'
import { FastClassifier } from './ml/FastClassifier'
import { Generator } from './ml/Generator'
import { HuggingfaceComponent } from './ml/Huggingface'
import { ItemTypeComponent } from './ml/ItemDetector'
import { KeywordExtractor } from './ml/KeywordExtractor'
import { NamedEntityRecognition } from './ml/NamedEntityRecognition'
import { ProseToScript } from './ml/ProseToScript'
import { SafetyVerifier } from './ml/SafetyVerifier'
import { SummarizeFacts } from './ml/SummarizeFacts'
import { TenseTransformer } from './ml/TenseTransformer'
import { TextToSpeech } from './ml/TextToSpeech'
import { TimeDetectorComponent } from './ml/TimeDetector'
import { DocumentDelete } from './search/DocumentDelete'
import { DocumentGet } from './search/DocumentGet'
import { DocumentSet } from './search/DocumentSet'
import { Search } from './search/Search'
import { StateRead } from './state/StateRead'
import { StateWrite } from './state/StateWrite'
import { JoinListComponent } from './strings/JoinList'
import { RandomStringFromList } from './strings/RandomStringFromList'
import { StringAdder } from './strings/StringAdder'
import { StringCombiner } from './strings/StringCombiner'
import { StringEvaluator } from './strings/StringEvaluator'
import { StringProcessor } from './strings/StringProcessor'
import { Alert } from './utility/AlertMessage'
import { Echo } from './utility/Echo'
import { ArrayVariable } from './variable/ArrayVariable'
import { BooleanVariable } from './variable/BooleanVariable'
import { FewshotVariable } from './variable/FewshotVariable'
import { NumberVariable } from './variable/NumberVariable'
import { StringVariable } from './variable/StringVariable'

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
  fastClassifier: () => new FastClassifier(),
  echo: () => new Echo(),
  SummarizeFacts: () => new SummarizeFacts(),
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
  Classifier: () => new Classifier(),
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
  inputsToJson: () => new InputsToJSON(),
  itemTypeComponent: () => new ItemTypeComponent(),
  joinListComponent: () => new JoinListComponent(),
  moduleComponent: () => new ModuleComponent(),
  proseToScript: () => new ProseToScript(),
  safetyVerifier: () => new SafetyVerifier(),
  output: () => new Output(),
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
