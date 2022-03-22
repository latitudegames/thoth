import type { Sequelize } from "sequelize";
import type { agentsAttributes, agentsCreationAttributes } from "./agents";
import { agents as _agents } from "./agents";
import type { agent_instanceAttributes, agent_instanceCreationAttributes } from "./agent_instance";
import { agent_instance as _agent_instance } from "./agent_instance";
import type { chainsAttributes, chainsCreationAttributes } from "./chains";
import { chains as _chains } from "./chains";
import type { eventsAttributes, eventsCreationAttributes } from "./events";
import { events as _events } from "./events";
import type { deployedSpellsAttributes, deployedSpellsCreationAttributes } from "./deployedSpells";
import { deployedSpells as _deployedSpells } from "./deployedSpells";
import type { documentsAttributes, documentsCreationAttributes } from "./documents";
import { documents as _documents } from "./documents";
import type { documentsStoreAttributes, documentsStoreCreationAttributes } from "./documentstores";
import { documentsStore as _documentsStore } from "./documentstores";
import type { contentObjAttributes, contentObjCreationAttributes } from "./content_objects";
import { contentObj as _contentObj } from "./content_objects";
import type { fewshotDataAttributes, fewshotDataCreationAttributes } from "./fewshotData";
import { fewshotData as _fewshotData } from "./fewshotData";
import type { fewshotSerializationAttributes, fewshotSerializationCreationAttributes } from "./fewshotSerialization";
import { fewshotSerialization as _fewshotSerialization } from "./fewshotSerialization";
import type { fewshotTaskAttributes, fewshotTaskCreationAttributes } from "./fewshotTask";
import { fewshotTask as _fewshotTask } from "./fewshotTask";
import type { wikipediaAttributes, wikipediaCreationAttributes } from "./wikipedia";
import { wikipedia as _wikipedia } from "./wikipedia";
export {
  _agent_instance as agent_instance,
  _agents as agents,
  _chains as chains,
  _events as events,
  _deployedSpells as deployedSpells,
  _documents as documents,
  _documentsStore as documentsStore,
  _contentObj as contentObj,
  _fewshotTask as fewshotTask,
  _fewshotSerialization as fewshotSerialization,
  _fewshotData as fewshotData,
  _wikipedia as wikipedia,
};
export type {
  agent_instanceAttributes,
  agent_instanceCreationAttributes,
  agentsAttributes,
  agentsCreationAttributes,
  chainsAttributes,
  chainsCreationAttributes,
  eventsAttributes,
  eventsCreationAttributes,
  deployedSpellsAttributes,
  deployedSpellsCreationAttributes,
  documentsAttributes,
  documentsCreationAttributes,
  documentsStoreAttributes,
  documentsStoreCreationAttributes,
  contentObjAttributes,
  contentObjCreationAttributes,
  fewshotDataAttributes,
  fewshotDataCreationAttributes,
  fewshotSerializationAttributes,
  fewshotSerializationCreationAttributes,
  fewshotTaskAttributes,
  fewshotTaskCreationAttributes,
  wikipediaAttributes,
  wikipediaCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const agent_instance = _agent_instance.initModel(sequelize);
  const agents = _agents.initModel(sequelize);
  const chains = _chains.initModel(sequelize);
  const events = _events.initModel(sequelize);
  const deployedSpells = _deployedSpells.initModel(sequelize);
  const documentsStore = _documentsStore.initModel(sequelize);
  const documents = _documents.initModel(sequelize);
  const contentObj = _contentObj.initModel(sequelize);
  const fewshotTask = _fewshotTask.initModel(sequelize);
  const fewshotSerialization = _fewshotSerialization.initModel(sequelize);
  const fewshotData = _fewshotData.initModel(sequelize);
  const wikipedia = _wikipedia.initModel(sequelize);

  return {
    agent_instance: agent_instance,
    agents: agents,
    chains: chains,
    events: events,
    deployedSpells: deployedSpells,
    contentObj: contentObj,
    documents: documents,
    documentsStore: documentsStore,
    fewshotTask: fewshotTask,
    fewshotSerialization: fewshotSerialization,
    fewshotData: fewshotData,
    wikipedia: wikipedia,
  };
}
