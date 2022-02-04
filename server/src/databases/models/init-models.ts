import type { Sequelize } from "sequelize";
import { xr_world_understanding_prompt as _xr_world_understanding_prompt } from "./xr_world_understanding_prompt"
import type { xr_world_understanding_promptAttributes, xr_world_understanding_promptCreationAttributes } from "./xr_world_understanding_prompt"
import { actions as _actions } from "./actions";
import type { actionsAttributes, actionsCreationAttributes } from "./actions";
import { agent_config as _agent_config } from "./agent_config";
import type { agent_configAttributes, agent_configCreationAttributes } from "./agent_config";
import { agent_fact_summarization as _agent_fact_summarization } from "./agent_fact_summarization";
import type { agent_fact_summarizationAttributes, agent_fact_summarizationCreationAttributes } from "./agent_fact_summarization";
import { agent_facts as _agent_facts } from "./agent_facts";
import type { agent_factsAttributes, agent_factsCreationAttributes } from "./agent_facts";
import { agent_facts_archive as _agent_facts_archive } from "./agent_facts_archive";
import type { agent_facts_archiveAttributes, agent_facts_archiveCreationAttributes } from "./agent_facts_archive";
import { agent_instance as _agent_instance } from "./agent_instance";
import type { agent_instanceAttributes, agent_instanceCreationAttributes } from "./agent_instance";
import { agents as _agents } from "./agents";
import type { agentsAttributes, agentsCreationAttributes } from "./agents";
import { bad_words as _bad_words } from "./bad_words";
import type { bad_wordsAttributes, bad_wordsCreationAttributes } from "./bad_words";
import { chains as _chains } from "./chains";
import type { chainsAttributes, chainsCreationAttributes } from "./chains";
import { chat_history as _chat_history } from "./chat_history";
import type { chat_historyAttributes, chat_historyCreationAttributes } from "./chat_history";
import { client_settings as _client_settings } from "./client_settings";
import type { client_settingsAttributes, client_settingsCreationAttributes } from "./client_settings";
import { config as _config } from "./config";
import type { configAttributes, configCreationAttributes } from "./config";
import { context as _context } from "./context";
import type { contextAttributes, contextCreationAttributes } from "./context";
import { conversation as _conversation } from "./conversation";
import type { conversationAttributes, conversationCreationAttributes } from "./conversation";
import { deployedSpells as _deployedSpells } from "./deployedSpells";
import type { deployedSpellsAttributes, deployedSpellsCreationAttributes } from "./deployedSpells";
import { dialogue as _dialogue } from "./dialogue";
import type { dialogueAttributes, dialogueCreationAttributes } from "./dialogue";
import { ethics as _ethics } from "./ethics";
import type { ethicsAttributes, ethicsCreationAttributes } from "./ethics";
import { facts as _facts } from "./facts";
import type { factsAttributes, factsCreationAttributes } from "./facts";
import { ignored_keywords as _ignored_keywords } from "./ignored_keywords";
import type { ignored_keywordsAttributes, ignored_keywordsCreationAttributes } from "./ignored_keywords";
import { keywords as _keywords } from "./keywords";
import type { keywordsAttributes, keywordsCreationAttributes } from "./keywords";
import { leading_statements as _leading_statements } from "./leading_statements";
import type { leading_statementsAttributes, leading_statementsCreationAttributes } from "./leading_statements";
import { meta as _meta } from "./meta";
import type { metaAttributes, metaCreationAttributes } from "./meta";
import { monologue as _monologue } from "./monologue";
import type { monologueAttributes, monologueCreationAttributes } from "./monologue";
import { morals as _morals } from "./morals";
import type { moralsAttributes, moralsCreationAttributes } from "./morals";
import { needs_motivations as _needs_motivations } from "./needs_motivations";
import type { needs_motivationsAttributes, needs_motivationsCreationAttributes } from "./needs_motivations";
import { opinion_form_prompt as _opinion_form_prompt } from "./opinion_form_prompt";
import type { opinion_form_promptAttributes, opinion_form_promptCreationAttributes } from "./opinion_form_prompt";
import { personality as _personality } from "./personality";
import type { personalityAttributes, personalityCreationAttributes } from "./personality";
import { personality_questions as _personality_questions } from "./personality_questions";
import type { personality_questionsAttributes, personality_questionsCreationAttributes } from "./personality_questions";
import { profane_responses as _profane_responses } from "./profane_responses";
import type { profane_responsesAttributes, profane_responsesCreationAttributes } from "./profane_responses";
import { rating as _rating } from "./rating";
import type { ratingAttributes, ratingCreationAttributes } from "./rating";
import { relationship_matrix as _relationship_matrix } from "./relationship_matrix";
import type { relationship_matrixAttributes, relationship_matrixCreationAttributes } from "./relationship_matrix";
import { room as _room } from "./room";
import type { roomAttributes, roomCreationAttributes } from "./room";
import { sensitive_phrases as _sensitive_phrases } from "./sensitive_phrases";
import type { sensitive_phrasesAttributes, sensitive_phrasesCreationAttributes } from "./sensitive_phrases";
import { sensitive_responses as _sensitive_responses } from "./sensitive_responses";
import type { sensitive_responsesAttributes, sensitive_responsesCreationAttributes } from "./sensitive_responses";
import { sensitive_words as _sensitive_words } from "./sensitive_words";
import type { sensitive_wordsAttributes, sensitive_wordsCreationAttributes } from "./sensitive_words";
import { speaker_fact_summarization as _speaker_fact_summarization } from "./speaker_fact_summarization";
import type { speaker_fact_summarizationAttributes, speaker_fact_summarizationCreationAttributes } from "./speaker_fact_summarization";
import { speaker_profane_responses as _speaker_profane_responses } from "./speaker_profane_responses";
import type { speaker_profane_responsesAttributes, speaker_profane_responsesCreationAttributes } from "./speaker_profane_responses";
import { speakers_facts as _speakers_facts } from "./speakers_facts";
import type { speakers_factsAttributes, speakers_factsCreationAttributes } from "./speakers_facts";
import { speakers_facts_archive as _speakers_facts_archive } from "./speakers_facts_archive";
import type { speakers_facts_archiveAttributes, speakers_facts_archiveCreationAttributes } from "./speakers_facts_archive";
import { speakers_model as _speakers_model } from "./speakers_model";
import type { speakers_modelAttributes, speakers_modelCreationAttributes } from "./speakers_model";
import { starting_message as _starting_message } from "./starting_message";
import type { starting_messageAttributes, starting_messageCreationAttributes } from "./starting_message";
import { wikipedia as _wikipedia } from "./wikipedia";
import type { wikipediaAttributes, wikipediaCreationAttributes } from "./wikipedia";
import { xr_engine_room_prompt as _xr_engine_room_prompt } from "./xr_engine_room_prompt";
import type { xr_engine_room_promptAttributes, xr_engine_room_promptCreationAttributes } from "./xr_engine_room_prompt";

export {
  _xr_world_understanding_prompt as xr_world_understanding_prompt,
  _actions as actions,
  _agent_config as agent_config,
  _agent_fact_summarization as agent_fact_summarization,
  _agent_facts as agent_facts,
  _agent_facts_archive as agent_facts_archive,
  _agent_instance as agent_instance,
  _agents as agents,
  _bad_words as bad_words,
  _chains as chains,
  _chat_history as chat_history,
  _client_settings as client_settings,
  _config as config,
  _context as context,
  _conversation as conversation,
  _deployedSpells as deployedSpells,
  _dialogue as dialogue,
  _ethics as ethics,
  _facts as facts,
  _ignored_keywords as ignored_keywords,
  _keywords as keywords,
  _leading_statements as leading_statements,
  _meta as meta,
  _monologue as monologue,
  _morals as morals,
  _needs_motivations as needs_motivations,
  _opinion_form_prompt as opinion_form_prompt,
  _personality as personality,
  _personality_questions as personality_questions,
  _profane_responses as profane_responses,
  _rating as rating,
  _relationship_matrix as relationship_matrix,
  _room as room,
  _sensitive_phrases as sensitive_phrases,
  _sensitive_responses as sensitive_responses,
  _sensitive_words as sensitive_words,
  _speaker_fact_summarization as speaker_fact_summarization,
  _speaker_profane_responses as speaker_profane_responses,
  _speakers_facts as speakers_facts,
  _speakers_facts_archive as speakers_facts_archive,
  _speakers_model as speakers_model,
  _starting_message as starting_message,
  _wikipedia as wikipedia,
  _xr_engine_room_prompt as xr_engine_room_prompt,
};

export type {
  xr_world_understanding_promptAttributes,
  xr_world_understanding_promptCreationAttributes,
  actionsAttributes,
  actionsCreationAttributes,
  agent_configAttributes,
  agent_configCreationAttributes,
  agent_fact_summarizationAttributes,
  agent_fact_summarizationCreationAttributes,
  agent_factsAttributes,
  agent_factsCreationAttributes,
  agent_facts_archiveAttributes,
  agent_facts_archiveCreationAttributes,
  agent_instanceAttributes,
  agent_instanceCreationAttributes,
  agentsAttributes,
  agentsCreationAttributes,
  bad_wordsAttributes,
  bad_wordsCreationAttributes,
  chainsAttributes,
  chainsCreationAttributes,
  chat_historyAttributes,
  chat_historyCreationAttributes,
  client_settingsAttributes,
  client_settingsCreationAttributes,
  configAttributes,
  configCreationAttributes,
  contextAttributes,
  contextCreationAttributes,
  conversationAttributes,
  conversationCreationAttributes,
  deployedSpellsAttributes,
  deployedSpellsCreationAttributes,
  dialogueAttributes,
  dialogueCreationAttributes,
  ethicsAttributes,
  ethicsCreationAttributes,
  factsAttributes,
  factsCreationAttributes,
  ignored_keywordsAttributes,
  ignored_keywordsCreationAttributes,
  keywordsAttributes,
  keywordsCreationAttributes,
  leading_statementsAttributes,
  leading_statementsCreationAttributes,
  metaAttributes,
  metaCreationAttributes,
  monologueAttributes,
  monologueCreationAttributes,
  moralsAttributes,
  moralsCreationAttributes,
  needs_motivationsAttributes,
  needs_motivationsCreationAttributes,
  opinion_form_promptAttributes,
  opinion_form_promptCreationAttributes,
  personalityAttributes,
  personalityCreationAttributes,
  personality_questionsAttributes,
  personality_questionsCreationAttributes,
  profane_responsesAttributes,
  profane_responsesCreationAttributes,
  ratingAttributes,
  ratingCreationAttributes,
  relationship_matrixAttributes,
  relationship_matrixCreationAttributes,
  roomAttributes,
  roomCreationAttributes,
  sensitive_phrasesAttributes,
  sensitive_phrasesCreationAttributes,
  sensitive_responsesAttributes,
  sensitive_responsesCreationAttributes,
  sensitive_wordsAttributes,
  sensitive_wordsCreationAttributes,
  speaker_fact_summarizationAttributes,
  speaker_fact_summarizationCreationAttributes,
  speaker_profane_responsesAttributes,
  speaker_profane_responsesCreationAttributes,
  speakers_factsAttributes,
  speakers_factsCreationAttributes,
  speakers_facts_archiveAttributes,
  speakers_facts_archiveCreationAttributes,
  speakers_modelAttributes,
  speakers_modelCreationAttributes,
  starting_messageAttributes,
  starting_messageCreationAttributes,
  wikipediaAttributes,
  wikipediaCreationAttributes,
  xr_engine_room_promptAttributes,
  xr_engine_room_promptCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const xr_world_understanding_prompt = _xr_world_understanding_prompt.initModel(sequelize);
  const actions = _actions.initModel(sequelize);
  const agent_config = _agent_config.initModel(sequelize);
  const agent_fact_summarization = _agent_fact_summarization.initModel(sequelize);
  const agent_facts = _agent_facts.initModel(sequelize);
  const agent_facts_archive = _agent_facts_archive.initModel(sequelize);
  const agent_instance = _agent_instance.initModel(sequelize);
  const agents = _agents.initModel(sequelize);
  const bad_words = _bad_words.initModel(sequelize);
  const chains = _chains.initModel(sequelize);
  const chat_history = _chat_history.initModel(sequelize);
  const client_settings = _client_settings.initModel(sequelize);
  const config = _config.initModel(sequelize);
  const context = _context.initModel(sequelize);
  const conversation = _conversation.initModel(sequelize);
  const deployedSpells = _deployedSpells.initModel(sequelize);
  const dialogue = _dialogue.initModel(sequelize);
  const ethics = _ethics.initModel(sequelize);
  const facts = _facts.initModel(sequelize);
  const ignored_keywords = _ignored_keywords.initModel(sequelize);
  const keywords = _keywords.initModel(sequelize);
  const leading_statements = _leading_statements.initModel(sequelize);
  const meta = _meta.initModel(sequelize);
  const monologue = _monologue.initModel(sequelize);
  const morals = _morals.initModel(sequelize);
  const needs_motivations = _needs_motivations.initModel(sequelize);
  const opinion_form_prompt = _opinion_form_prompt.initModel(sequelize);
  const personality = _personality.initModel(sequelize);
  const personality_questions = _personality_questions.initModel(sequelize);
  const profane_responses = _profane_responses.initModel(sequelize);
  const rating = _rating.initModel(sequelize);
  const relationship_matrix = _relationship_matrix.initModel(sequelize);
  const room = _room.initModel(sequelize);
  const sensitive_phrases = _sensitive_phrases.initModel(sequelize);
  const sensitive_responses = _sensitive_responses.initModel(sequelize);
  const sensitive_words = _sensitive_words.initModel(sequelize);
  const speaker_fact_summarization = _speaker_fact_summarization.initModel(sequelize);
  const speaker_profane_responses = _speaker_profane_responses.initModel(sequelize);
  const speakers_facts = _speakers_facts.initModel(sequelize);
  const speakers_facts_archive = _speakers_facts_archive.initModel(sequelize);
  const speakers_model = _speakers_model.initModel(sequelize);
  const starting_message = _starting_message.initModel(sequelize);
  const wikipedia = _wikipedia.initModel(sequelize);
  const xr_engine_room_prompt = _xr_engine_room_prompt.initModel(sequelize);


  return {
    xr_world_understanding_prompt: xr_world_understanding_prompt,
    actions: actions,
    agent_config: agent_config,
    agent_fact_summarization: agent_fact_summarization,
    agent_facts: agent_facts,
    agent_facts_archive: agent_facts_archive,
    agent_instance: agent_instance,
    agents: agents,
    bad_words: bad_words,
    chains: chains,
    chat_history: chat_history,
    client_settings: client_settings,
    config: config,
    context: context,
    conversation: conversation,
    deployedSpells: deployedSpells,
    dialogue: dialogue,
    ethics: ethics,
    facts: facts,
    ignored_keywords: ignored_keywords,
    keywords: keywords,
    leading_statements: leading_statements,
    meta: meta,
    monologue: monologue,
    morals: morals,
    needs_motivations: needs_motivations,
    opinion_form_prompt: opinion_form_prompt,
    personality: personality,
    personality_questions: personality_questions,
    profane_responses: profane_responses,
    rating: rating,
    relationship_matrix: relationship_matrix,
    room: room,
    sensitive_phrases: sensitive_phrases,
    sensitive_responses: sensitive_responses,
    sensitive_words: sensitive_words,
    speaker_fact_summarization: speaker_fact_summarization,
    speaker_profane_responses: speaker_profane_responses,
    speakers_facts: speakers_facts,
    speakers_facts_archive: speakers_facts_archive,
    speakers_model: speakers_model,
    starting_message: starting_message,
    wikipedia: wikipedia,
    xr_engine_room_prompt: xr_engine_room_prompt,
  };
}
