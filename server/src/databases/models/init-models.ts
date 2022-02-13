import type { Sequelize } from "sequelize";
import type { agentsAttributes, agentsCreationAttributes } from "./agents";
import { agents as _agents } from "./agents";
import type { agent_instanceAttributes, agent_instanceCreationAttributes } from "./agent_instance";
import { agent_instance as _agent_instance } from "./agent_instance";
import type { chainsAttributes, chainsCreationAttributes } from "./chains";
import { chains as _chains } from "./chains";
import type { client_settingsAttributes, client_settingsCreationAttributes } from "./client_settings";
import { client_settings as _client_settings } from "./client_settings";
import type { configAttributes, configCreationAttributes } from "./config";
import { config as _config } from "./config";
import type { contextAttributes, contextCreationAttributes } from "./context";
import { context as _context } from "./context";
import type { conversationAttributes, conversationCreationAttributes } from "./conversation";
import { conversation as _conversation } from "./conversation";
import type { deployedSpellsAttributes, deployedSpellsCreationAttributes } from "./deployedSpells";
import { deployedSpells as _deployedSpells } from "./deployedSpells";
import type { fewshotDataAttributes, fewshotDataCreationAttributes } from "./fewshotData";
import { fewshotData as _fewshotData } from "./fewshotData";
import type { fewshotSerializationAttributes, fewshotSerializationCreationAttributes } from "./fewshotSerialization";
import { fewshotSerialization as _fewshotSerialization } from "./fewshotSerialization";
import type { fewshotTaskAttributes, fewshotTaskCreationAttributes } from "./fewshotTask";
import { fewshotTask as _fewshotTask } from "./fewshotTask";
import type { opinion_form_promptAttributes, opinion_form_promptCreationAttributes } from "./opinion_form_prompt";
import { opinion_form_prompt as _opinion_form_prompt } from "./opinion_form_prompt";
import type { personality_questionsAttributes, personality_questionsCreationAttributes } from "./personality_questions";
import { personality_questions as _personality_questions } from "./personality_questions";
import type { speaker_fact_summarizationAttributes, speaker_fact_summarizationCreationAttributes } from "./speaker_fact_summarization";
import { speaker_fact_summarization as _speaker_fact_summarization } from "./speaker_fact_summarization";
import type { wikipediaAttributes, wikipediaCreationAttributes } from "./wikipedia";
import { wikipedia as _wikipedia } from "./wikipedia";
import type { xr_engine_room_promptAttributes, xr_engine_room_promptCreationAttributes } from "./xr_engine_room_prompt";
import { xr_engine_room_prompt as _xr_engine_room_prompt } from "./xr_engine_room_prompt";
import type { xr_world_understanding_promptAttributes, xr_world_understanding_promptCreationAttributes } from "./xr_world_understanding_prompt";
import { xr_world_understanding_prompt as _xr_world_understanding_prompt } from "./xr_world_understanding_prompt";

export {
  _xr_world_understanding_prompt as xr_world_understanding_prompt,
  _agent_instance as agent_instance,
  _agents as agents,
  _chains as chains,
  _client_settings as client_settings,
  _config as config,
  _context as context,
  _conversation as conversation,
  _deployedSpells as deployedSpells,
  _fewshotTask as fewshotTask,
  _fewshotSerialization as fewshotSerialization,
  _fewshotData as fewshotData,
  _opinion_form_prompt as opinion_form_prompt,
  _personality_questions as personality_questions,
  _speaker_fact_summarization as speaker_fact_summarization,
  _wikipedia as wikipedia,
  _xr_engine_room_prompt as xr_engine_room_prompt,
};
export type {
  xr_world_understanding_promptAttributes,
  xr_world_understanding_promptCreationAttributes,
  agent_instanceAttributes,
  agent_instanceCreationAttributes,
  agentsAttributes,
  agentsCreationAttributes,
  chainsAttributes,
  chainsCreationAttributes,
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
  fewshotDataAttributes,
  fewshotDataCreationAttributes,
  fewshotSerializationAttributes,
  fewshotSerializationCreationAttributes,
  fewshotTaskAttributes,
  fewshotTaskCreationAttributes,
  opinion_form_promptAttributes,
  opinion_form_promptCreationAttributes,
  personality_questionsAttributes,
  personality_questionsCreationAttributes,
  speaker_fact_summarizationAttributes,
  speaker_fact_summarizationCreationAttributes,
  wikipediaAttributes,
  wikipediaCreationAttributes,
  xr_engine_room_promptAttributes,
  xr_engine_room_promptCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const xr_world_understanding_prompt = _xr_world_understanding_prompt.initModel(sequelize);
  const agent_instance = _agent_instance.initModel(sequelize);
  const agents = _agents.initModel(sequelize);
  const chains = _chains.initModel(sequelize);
  const client_settings = _client_settings.initModel(sequelize);
  const config = _config.initModel(sequelize);
  const context = _context.initModel(sequelize);
  const conversation = _conversation.initModel(sequelize);
  const deployedSpells = _deployedSpells.initModel(sequelize);
  const fewshotTask = _fewshotTask.initModel(sequelize);
  const fewshotSerialization = _fewshotSerialization.initModel(sequelize);
  const fewshotData = _fewshotData.initModel(sequelize);
  const opinion_form_prompt = _opinion_form_prompt.initModel(sequelize);
  const personality_questions = _personality_questions.initModel(sequelize);
  const speaker_fact_summarization = _speaker_fact_summarization.initModel(sequelize);
  const wikipedia = _wikipedia.initModel(sequelize);
  const xr_engine_room_prompt = _xr_engine_room_prompt.initModel(sequelize);

  return {
    xr_world_understanding_prompt: xr_world_understanding_prompt,
    agent_instance: agent_instance,
    agents: agents,
    chains: chains,
    client_settings: client_settings,
    config: config,
    context: context,
    conversation: conversation,
    deployedSpells: deployedSpells,
    fewshotTask: fewshotTask,
    fewshotSerialization: fewshotSerialization,
    fewshotData: fewshotData,
    opinion_form_prompt: opinion_form_prompt,
    personality_questions: personality_questions,
    speaker_fact_summarization: speaker_fact_summarization,
    wikipedia: wikipedia,
    xr_engine_room_prompt: xr_engine_room_prompt,
  };
}
