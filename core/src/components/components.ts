import { AddAgent } from './agent/AddAgent'
import { AgentTextCompletion } from './agent/AgentTextCompletion'
import { CacheManagerDelete } from './agent/CacheManagerDelete'
import { CacheManagerGet } from './agent/CacheManagerGet'
import { CacheManagerSet } from './agent/CacheManagerSet'
import { CreateOrGetAgent } from './agent/CreateOrGetAgent'
import { EventRecall } from './agent/EventRecall'
import { EventStore } from './agent/EventStore'
import { GetAgentData } from './agent/GetAgentData'
import { GetAgentPersonality } from './agent/GetAgentPersonality'
import { InputDestructureComponent } from './agent/InputDestructure'
import { Request } from './agent/Request'
import { InputComponent } from './io/Input'
import { ModuleComponent } from './io/Module'
import { Output } from './io/Output'
import { TriggerIn } from './io/TriggerIn'
import { TriggerOut } from './io/TriggerOut'
import { BooleanGate } from './logic/BooleanGate'
import { Coallesce } from './logic/Coallesce'
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
import { Generator } from './ml/Generator'
import { HuggingfaceComponent } from './ml/Huggingface'
import { ItemTypeComponent } from './ml/ItemDetector'
import { KeywordExtractor } from './ml/KeywordExtractor'
import { NamedEntityRecognition } from './ml/NamedEntityRecognition'
import { ProseToScript } from './ml/ProseToScript'
import { SafetyVerifier } from './ml/SafetyVerifier'
import { SentenceMatcher } from './ml/SentenceMatcher'
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
import { ComplexStringMatcher } from './strings/ComplexStringMatcher'
import { JoinListComponent } from './strings/JoinList'
import { RandomStringFromList } from './strings/RandomStringFromList'
import { StringAdder } from './strings/StringAdder'
import { StringCombiner } from './strings/StringCombiner'
import { StringEvaluator } from './strings/StringEvaluator'
import { StringProcessor } from './strings/StringProcessor'
import { Alert } from './utility/AlertMessage'
import { Echo } from './utility/Echo'
import { InputsToJSON } from './utility/InputsToJSON'
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
  coallesce: () => new Coallesce(),
  code: () => new Code(),
  sentenceMatcher: () => new SentenceMatcher(),
  difficultyDetectorComponent: () => new DifficultyDetectorComponent(),
  // enkiTask: () => new EnkiTask(),
  entityDetector: () => new EntityDetector(),
  complexStringMatcher: () => new ComplexStringMatcher(),
  echo: () => new Echo(),
  SummarizeFacts: () => new SummarizeFacts(),
  textToSpeech: () => new TextToSpeech(),
  agentTextCompletion: () => new AgentTextCompletion(),
  getAgentPersonality: () => new GetAgentPersonality(),
  keywordExtractor: () => new KeywordExtractor(),
  namedEntityRecognition: () => new NamedEntityRecognition(),
  createOrGetAgent: () => new CreateOrGetAgent(),
  Classifier: () => new Classifier(),
  getAgentData: () => new GetAgentData(),
  isNullOrUndefined: () => new IsNullOrUndefined(),
  isVariableTrue: () => new IsVariableTrue(),
  conversationStore: () => new EventStore(),
  conversationRecall: () => new EventRecall(),
  request: () => new Request(),
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
  stringVariable: () => new StringVariable(),
  fewshotVariable: () => new FewshotVariable(),
  stringAdder: () => new StringAdder(),
  numberVariable: () => new NumberVariable(),
  booleanVariable: () => new BooleanVariable(),
  arrayVariable: () => new ArrayVariable(),
  addAgent: () => new AddAgent(),
  logicalOperator: () => new LogicalOperator(),
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
