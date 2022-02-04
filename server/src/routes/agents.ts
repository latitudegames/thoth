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
  if (!database.instance) return ctx.body = []
  const agents = await database.instance.getAgents();
  ctx.body = agents
}

const getAgentHandler = async (ctx: Koa.Context) => {
  const agent = ctx.query.agent;
  if (!database.instance) return ctx.body = {}
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
]


//Routes for the express server
// export async function registerRoutes(app) {
//   app.get('/get_profanity_data', async function (req, res) {
//     const editorId = req.query.editor_id;

//     if (editorId == 1) {
//       return res.send({ data: (await database.instance.getBadWords()).toString().split("\n") });
//     } else if (editorId == 2) {
//       return res.send({ data: (await database.instance.getSensitiveWords()).toString().split("\r\n") });
//     } else if (editorId == 3) {
//       return res.send({ data: (await database.instance.getSensitivePhrases()).toString().split("\n") });
//     } else if (editorId == 4) {
//       return res.send({ data: (await database.instance.getLeadingStatements()).toString().split("\n") });
//     }

//     return res.send('invalid editor id');
//   });
//   app.post('/add_profanity_word', async function (req, res) {
//     const word = req.body.word;
//     const editorId = req.body.editorId;

//     if (editorId == 1) {
//       if (await database.instance.badWordExists(word)) {
//         return res.send('already exists');
//       }

//       await database.instance.addBadWord(word);
//       return res.send('ok');
//     } else if (editorId == 2) {
//       if (await database.instance.sensitiveWordExists(word)) {
//         return res.send('already exists');
//       }

//       await database.instance.addSensitiveWord(word);
//       return res.send('ok');
//     } else if (editorId == 3) {
//       if (await database.instance.sensitivePhraseExists(word)) {
//         return res.send('already exists');
//       }

//       await database.instance.addSensitivePhrase(word);
//       return res.send('ok');
//     } else if (editorId == 4) {
//       if (await database.instance.leadingStatementExists(word)) {
//         return res.send('already exists');
//       }

//       await database.instance.addLeadingStatement(word);
//       return res.send('ok');
//     }

//     return res.send('invalid editor id');
//   });
//   app.post('/remove_profanity_word', async function (req, res) {
//     const word = req.body.word;
//     const editorId = req.body.editorId;

//     if (editorId == 1) {
//       await database.instance.removeBadWord(word);
//       return res.send('ok');
//     } else if (editorId == 2) {
//       await database.instance.removeSensitiveWord(word);
//       return res.send('ok');
//     } else if (editorId == 3) {
//       await database.instance.removeSensitivePhrase(word);
//       return res.send('ok');
//     } else if (editorId == 4) {
//       await database.instance.removeLeadingStatement(word);
//       return res.send('ok');
//     }

//     return res.send('invalid editor id');
//   });


//   //return the configurations of the server
//   app.get('/config', async function (req, res) {
//     const data = {
//       config: customConfig.instance.allToArray()
//     };

//     return res.send(data);
//   });

//   //updates the config values and restarts the server afterwords
//   app.put('/config', async function (req, res) {
//     const data = req.body.config;

//     try {
//       for (let i = 0; i < data.length; i++) {
//         await customConfig.instance.set(data[i].key, data[i].value);
//       }

//       res.send('ok');
//       console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   app.delete('/config', async function (req, res) {
//     const data = req.body.data;

//     try {
//       await customConfig.instance.delete(data.key);
//       res.send('ok');
//       console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   app.post('/config', async function (req, res) {
//     const data = req.body.data;

//     try {
//       await customConfig.instance.set(data.key, data.value);
//       res.send('ok');
//       console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   //execute is used to run a command, like become an agent
//   app.post("/execute", async function (req, res) {
//     const message = req.body.command
//     const speaker = req.body.sender
//     const agent = req.body.agent
//     const id = req.body.id;
//     const msg = database.instance.getRandomStartingMessage(agent)
//     if (message.includes("/become")) {
//       let out = {}
//       if (!(await database.instance.getAgentExists(agent))) {
//         out = await createWikipediaAgent("Speaker", agent, "", "");
//       }

//       out.startingMessage = (await msg);
//       database.instance.setConversation(agent, 'web', id, agent, out.startingMessage, false);
//       return res.send(out);

//     }
//     await handleInput(message, speaker, agent, res, 'web', id)
//   });

//   app.get('/agentConfig', async function (req, res) {
//     try {
//       return res.send(await database.instance.getAgentsConfig('common'));
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });
//   app.post('/agentConfig', async function (req, res) {
//     const data = req.body.data;

//     try {
//       await database.instance.setAgentsConfig('common', data);
//       return res.send('ok');
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   app.get('/prompts', async function (req, res) {
//     try {
//       const data = {
//         xr_world: await database.instance.get3dWorldUnderstandingPrompt(),
//         fact: await database.instance.getAgentsFactsSummarization(),
//         opinion: await database.instance.getOpinionFormPrompt(),
//         xr: await database.instance.getXrEngineRoomPrompt(),
//       }

//       return res.send(data);
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });
//   app.post('/prompts', async function (req, res) {
//     const data = req.body.data;

//     try {
//       await database.instance.set3dWorldUnderstandingPrompt(data.xr_world);
//       await database.instance.setAgentsFactsSummarization(data.fact);
//       await database.instance.setOpinionFormPrompt(data.opinion);
//       await database.instance.setXrEngineRoomPrompt(data.xr);

//       return res.send('ok');
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   app.get('/agentInstances', async function (req, res) {
//     try {
//       let data = await database.instance.getAgentInstances();
//       return res.send(data);
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   app.get('/agentInstance', async function (req, res) {
//     try {
//       const instanceId = req.query.instanceId;
//       const isNum = /^\d+$/.test(instanceId);
//       const _instanceId = isNum ? parseInt(instanceId) ? parseInt(instanceId) >= 1 ? parseInt(instanceId) : 1 : 1 : 1;
//       let data = await database.instance.getAgentInstance(_instanceId);
//       if (data === undefined || !data) {
//         let newId = _instanceId;
//         while (await database.instance.instanceIdExists(newId) || newId <= 0) {
//           newId++;
//         }

//         data = {
//           id: newId,
//           personality: '',
//           clients: clientSettingsToInstance(await database.instance.getAllClientSettings()),
//           enabled: true
//         }
//       }
//       console.log(data);
//       return res.send(data);
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });

//   app.post('/agentInstance', async function (req, res) {
//     console.log('data');
//     console.log(req.data);
//     const data = req.body.data;
//     const instanceId = data.id;
//     const personality = data.personality?.trim();
//     const clients = data.clients;
//     const enabled = data.enabled;

//     if (!instanceId) {
//       await database.instance.createAgentInstance();
//       res.send('ok');
//       console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
//     }

//     try {
//       await database.instance.updateAgentInstances(instanceId, personality, clients, enabled);
//       res.send('ok');
//       console.log("TODO: Not exiting process here, we need to make sure we set config properly in this process")
//     } catch (e) {
//       error(e);
//       return res.send('internal error');
//     }
//   });
// }