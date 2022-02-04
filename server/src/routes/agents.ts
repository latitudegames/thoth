import { createWikipediaAgent } from '@latitudegames/thoth-core/src/connectors/wikipedia.js';
import customConfig from "@latitudegames/thoth-core/src/superreality/customConfig";
import { database } from '@latitudegames/thoth-core/src/superreality/database';
import { handleInput } from '@latitudegames/thoth-core/src/superreality/handleInput';
import Koa from 'koa';
import 'regenerator-runtime/runtime.js';
import { noAuth } from '../middleware/auth';
import { Route } from '../types';

export const modules: Record<string, unknown> = {}

function clientSettingsToInstance(settings: any) {
  function addSettingForClient(array: any, client: any, setting: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].client === client) {
        array[i].settings.push({ name: setting._name, value: setting._value })
        return array
      }
    }

    array.push({
      client: client,
      enabled: false,
      settings: [{ name: setting._name, value: setting._defaultValue }],
    })
    return array
  }

  let res = []

  for (let i = 0; i < settings.length; i++) {
    res = addSettingForClient(res, settings[i].client, {
      _name: settings[i].name,
      _value: settings[i].defaultValue,
    })
  }

  return res
}

const getAgentsHandler = async (ctx: Koa.Context) => {
  const agents = await database.instance.getAgents();
  ctx.body = agents
}

const getAgentHandler = async (ctx: Koa.Context) => {
  const agent = ctx.query.agent;
  ctx.body = {
    actions: (await database.instance.getActions(agent)).trim(),
    dialogue: (await database.instance.getDialogue(agent)).trim(),
    ethics: (await database.instance.getEthics(agent)).trim(),
    facts: (await database.instance.getAgentFacts(agent)).trim(),
    monologue: (await database.instance.getMonologue(agent)).trim(),
    needsAndMotivation: (await database.instance.getNeedsAndMotivations(agent)).trim(),
    personality: (await database.instance.getPersonality(agent)).trim(),
    room: (await database.instance.getRoom(agent)).trim(),
    startingPhrases: (await database.instance.getStartingPhrases(agent)).trim(),
    ignoredKeywords: (await database.instance.getIgnoredKeywordsData(agent)).trim(),
  };
}

const createOrUpdateAgentHandler = async (ctx: Koa.Context) => {
  const { agentName, data } = ctx.request.body;
  if (!agentName || agentName == undefined || agentName.length <= 0) {
    return ctx.body = { error: 'invalid agent name' };

  }

  const agentExists = await database.instance.getAgentExists(agentName);
  if (!agentExists) {
    // TODO: Combine all of these!
    try {
      await database.instance.setActions(agentName, data.actions);
      await database.instance.setDialogue(agentName, data.dialogue);
      await database.instance.setEthics(agentName, data.ethics);
      await database.instance.setAgentFacts(agentName, data.facts, true);
      await database.instance.setMonologue(agentName, data.monologue);
      await database.instance.setNeedsAndMotivations(agentName, data.needsAndMotivation);
      await database.instance.setPersonality(agentName, data.personality);
      await database.instance.setRoom(agentName, data.room);
      await database.instance.setStartingPhrases(agentName, data.startingPhrases);
      await database.instance.setIgnoredKeywords(agentName, data.ignoredKeywords);
    } catch (e) {
      return ctx.body = { error: 'internal error' };
    }
  }

  try {
    // TODO: Combine all of these!

    await database.instance.setAgentExists(agentName);
    if (!data.actions || data.actions === undefined) data.actions = '';
    await database.instance.setActions(agentName, data.actions);
    if (!data.dialogue || data.dialogue === undefined) data.dialogue = '';
    await database.instance.setDialogue(agentName, data.dialogue);
    if (!data.ethics || data.ethics === undefined) data.ethics = '';
    await database.instance.setEthics(agentName, data.ethics);
    if (!data.facts || data.facts === undefined) data.facts = '';
    await database.instance.setAgentFacts(agentName, data.facts);
    if (!data.monologue || data.monologue === undefined) data.monologue = '';
    await database.instance.setMonologue(agentName, data.monologue);
    if (!data.needsAndMotivation || data.needsAndMotivation === undefined) data.needsAndMotivation = '';
    await database.instance.setNeedsAndMotivations(agentName, data.needsAndMotivation);
    if (!data.personality || data.personality === undefined) data.personality = '';
    await database.instance.setPersonality(agentName, data.personality);
    if (!data.room || data.room === undefined) data.room = '';
    await database.instance.setRoom(agentName, data.room);
    if (!data.startingPhrases || data.startingPhrases === undefined) data.startingPhrases = '';
    await database.instance.setStartingPhrases(agentName, data.startingPhrases);
    if (!data.ignoredKeywords || data.ignoredKeywords === undefined) data.ignoredKeywords = '';
    await database.instance.setIgnoredKeywords(agentName, data.ignoredKeywords);
  } catch (e) {
    return ctx.body = { error: 'internal error' };
  }

  ctx.body = 'ok';
}

const deleteAgentHandler = async (ctx: Koa.Context) => {
  const { agentName } = ctx.request.body;
  if (agentName === 'common') {
    return ctx.body = { error: 'you can\'t delete the default agent' }
  }

  await database.instance.deleteAgent(agentName);

  return ctx.body = 'ok';
}

const getProfanityHandler = async (ctx: Koa.Context) => {
  const editorId = ctx.query.editor_id;

  if (editorId === "1") {
    return ctx.body = { data: (await database.instance.getBadWords()).toString().split("\n") };
  } else if (editorId === "2") {
    return ctx.body = { data: (await database.instance.getSensitiveWords()).toString().split("\r\n") };
  } else if (editorId === "3") {
    return ctx.body = { data: (await database.instance.getSensitivePhrases()).toString().split("\n") };
  } else if (editorId === "4") {
    return ctx.body = { data: (await database.instance.getLeadingStatements()).toString().split("\n") };
  }
  ctx.body = 'invalid editor id';
}

const addProfanityHandler = async (ctx: Koa.Context) => {
  const word = ctx.request.body.word;
  const editorId = ctx.request.body.editorId;

  if (editorId == 1) {
    if (await database.instance.badWordExists(word)) {
      return ctx.body = { error: 'already exists' };
    }

    await database.instance.addBadWord(word);
    return ctx.body = 'ok';
  } else if (editorId == 2) {
    if (await database.instance.sensitiveWordExists(word)) {
      return ctx.body = { error: 'already exists' };
    }

    await database.instance.addSensitiveWord(word);
    return ctx.body = 'ok';
  } else if (editorId == 3) {
    if (await database.instance.sensitivePhraseExists(word)) {
      return ctx.body = { error: 'already exists' };
    }

    await database.instance.addSensitivePhrase(word);
    return ctx.body = 'ok';
  } else if (editorId == 4) {
    if (await database.instance.leadingStatementExists(word)) {
      return ctx.body = { error: 'already exists' };
    }

    await database.instance.addLeadingStatement(word);
    return ctx.body = 'ok';
  }
  ctx.body = { error: 'invalid editor id' };
}

const deleteProfanityHandler = async (ctx: Koa.Context) => {
  const word = ctx.request.body.word;
  const editorId = ctx.request.body.editorId;

  if (editorId == 1) {
    await database.instance.removeBadWord(word);
    return ctx.body = 'ok';
  } else if (editorId == 2) {
    await database.instance.removeSensitiveWord(word);
    return ctx.body = 'ok';
  } else if (editorId == 3) {
    await database.instance.removeSensitivePhrase(word);
    return ctx.body = 'ok';
  } else if (editorId == 4) {
    await database.instance.removeLeadingStatement(word);
    return ctx.body = 'ok';
  }

  ctx.body = { error: 'invalid editor id' };
}

const getConfigHandler = async (ctx: Koa.Context) => {
  const data = {
    config: customConfig.instance.allToArray()
  };

  return ctx.body = data;
}

const addConfigHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data;

  try {
    await customConfig.instance.set(data.key, data.value);
    ctx.body = 'ok';
    console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const updateConfigHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.config;
  try {
    for (let i = 0; i < data.length; i++) {
      await customConfig.instance.set(data[i].key, data[i].value);
    }

    ctx.body = 'ok';
    console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const deleteConfigHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data;

  try {
    await customConfig.instance.delete(data.key);
    ctx.body = 'ok';
    console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const executeHandler = async (ctx: Koa.Context) => {
  const message = ctx.request.body.command
  const speaker = ctx.request.body.sender
  const agent = ctx.request.body.agent
  const id = ctx.request.body.id;
  const msg = database.instance.getRandomStartingMessage(agent)
  if (message.includes("/become")) {
    let out: any = {}
    if (!(await database.instance.getAgentExists(agent))) {
      out = await createWikipediaAgent("Speaker", agent, "", "");
    }

    out.startingMessage = (await msg);
    database.instance.setConversation(agent, 'web', id, agent, out.startingMessage, false);
    return ctx.body = out;

  }
  ctx.body = await handleInput(message, speaker, agent, null, 'web', id)
}

const getAgentConfigHandler = async (ctx: Koa.Context) => {
  try {
    const body = await database.instance.getAgentsConfig(ctx.request.body.agent ?? 'common') ?? {};
    return ctx.body = body;
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const addAgentConfigHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data;

  try {
    return ctx.body = await database.instance.setAgentsConfig('common', data);
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const getPromptsHandler = async (ctx: Koa.Context) => {
  try {
    const data = {
      xr_world: await database.instance.get3dWorldUnderstandingPrompt(),
      fact: await database.instance.getAgentsFactsSummarization(),
      opinion: await database.instance.getOpinionFormPrompt(),
      xr: await database.instance.getXrEngineRoomPrompt(),
    }

    return ctx.body = data;
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const addPromptsHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data;

  try {
    await database.instance.set3dWorldUnderstandingPrompt(data.xr_world);
    await database.instance.setAgentsFactsSummarization(data.fact);
    await database.instance.setOpinionFormPrompt(data.opinion);
    await database.instance.setXrEngineRoomPrompt(data.xr);

    return ctx.body = 'ok';
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const getAgentInstancesHandler = async (ctx: Koa.Context) => {
  try {
    let data = await database.instance.getAgentInstances();
    return ctx.body = data;
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const getAgentInstanceHandler = async (ctx: Koa.Context) => {
  try {
    const instanceId = ctx.request.query.instanceId as string;
    const isNum = /^\d+$/.test(instanceId);
    const _instanceId = isNum ? parseInt(instanceId) ? parseInt(instanceId) >= 1 ? parseInt(instanceId) : 1 : 1 : 1;
    let data = await database.instance.getAgentInstance(_instanceId);
    if (data === undefined || !data) {
      let newId = _instanceId;
      while (await database.instance.instanceIdExists(newId) || newId <= 0) {
        newId++;
      }

      data = {
        id: newId,
        personality: '',
        clients: clientSettingsToInstance(await database.instance.getAllClientSettings()),
        enabled: true
      }
    }
    return ctx.body = data;
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const addAgentInstanceHandler = async (ctx: Koa.Context) => {
  const data = ctx.request.body.data;
  const instanceId = data.id;
  const personality = data.personality?.trim();
  const clients = data.clients;
  const enabled = data.enabled;

  if (!instanceId) {
    await database.instance.createAgentInstance();
    ctx.body = 'ok';
    console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
  }

  try {
    await database.instance.updateAgentInstances(instanceId, personality, clients, enabled);
    ctx.body = 'ok';
    console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
  } catch (e) {
    console.error(e);
    return ctx.body = { error: 'internal error' };
  }
}

const deleteAgentInstanceHandler = async (ctx: Koa.Context) => {
  const { agentName } = ctx.request.body;

  await database.instance.deleteAgentInstance(agentName);

  return ctx.body = 'ok';
}

export const agents: Route[] = [
  {
    path: '/agents',
    access: noAuth,
    get: getAgentsHandler,
  },

  {
    path: '/agent',
    access: noAuth,
    get: getAgentHandler,
    post: createOrUpdateAgentHandler,
    delete: deleteAgentHandler
  },
  {
    path: '/profanity',
    access: noAuth,
    post: getProfanityHandler,
  },
  {
    path: '/profanity',
    access: noAuth,
    get: getProfanityHandler,
    post: addProfanityHandler,
    delete: deleteProfanityHandler
  },
  {
    path: '/config',
    access: noAuth,
    get: getConfigHandler,
    post: addConfigHandler,
    put: updateConfigHandler,
    delete: deleteConfigHandler
  },
  {
    path: '/agentConfig',
    access: noAuth,
    get: getAgentConfigHandler,
    post: addAgentConfigHandler
  },
  {
    path: '/prompts',
    access: noAuth,
    get: getPromptsHandler,
    post: addPromptsHandler
  },
  {
    path: '/execute', // remove me
    access: noAuth,
    post: executeHandler,
  },
  {
    path: '/agentInstances', // remove me
    access: noAuth,
    get: getAgentInstancesHandler,
  },
  {
    path: '/agentInstance', // remove me
    access: noAuth,
    get: getAgentInstanceHandler,
    post: addAgentInstanceHandler,
    delete: deleteAgentInstanceHandler

  },
]