// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

// TODO: Turn into a node

import { database } from '../connectors/database'
import keywordExtractor from './keywordExtractor'

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

//generates the context for the open ai request, it gets the default configration from the website and replaces it with the agent's specifics
export async function generateContext(speaker, agent_, conversation, message) {
  const [keywords, speakerFacts, agentFacts, agent] = await Promise.all([
    keywordExtractor(message, agent_),
    database.instance.getSpeakersFacts(agent_, speaker),
    database.instance.getAgentFacts(agent_),
    database.instance.getAgent(agent_),
  ])

  let kdata = ''
  if (keywords.length > 0) {
    kdata = 'More context on the chat:\n'
    for (const k in keywords) {
      kdata +=
        'Q: ' +
        capitalizeFirstLetter(keywords[k].word) +
        '\nA: ' +
        keywords[k].info +
        '\n\n'
    }
    kdata += '\n'
  }

  // Return a complex context (this will be passed to the transformer for completion)
  return (await database.instance.getContext())
    .toString()
    .replaceAll('$morals', agent.morals)
    .replaceAll('$personality', agent.perseonality)
    .replaceAll('$exampleDialog', agent.dialog)
    .replaceAll('$monologue', agent.monologue)
    .replaceAll('$facts', agent.facts)
    .replaceAll('$speakerFacts', speakerFacts)
    .replaceAll('$agentFacts', agentFacts)
    .replaceAll('$keywords', kdata)
    .replaceAll('$agent', agent.agent)
    .replaceAll('$speaker', speaker)
    .replaceAll('$conversation', conversation)
}
