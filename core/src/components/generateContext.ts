// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { database } from '../superreality/database'
import keywordExtractor from './keywordExtractor'

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

//generates the context for the open ai request, it gets the default configration from the website and replaces it with the agent's specifics
export async function generateContext(speaker, agent, conversation, message) {
    const keywords = keywordExtractor(message, agent)

    const pr = await Promise.all([
        keywords,
        database.instance.getSpeakersFacts(agent, speaker),
        database.instance.getAgentFacts(agent),
        database.instance.getRoom(agent),
        database.instance.getMorals(),
        database.instance.getEthics(agent),
        database.instance.getPersonality(agent),
        database.instance.getNeedsAndMotivations(agent),
        database.instance.getDialogue(agent),
        database.instance.getMonologue(agent),
        database.instance.getFacts(agent),
    ])

    pr[1] = pr[1].toString().trim().replaceAll('\n\n', '\n')
    pr[2] = pr[2].toString().trim().replaceAll('\n\n', '\n')

    let kdata = ''
    if (pr[0].length > 0) {
        kdata = 'More context on the chat:\n'
        for (const k in pr[0]) {
            kdata +=
                'Q: ' +
                capitalizeFirstLetter(pr[0][k].word) +
                '\nA: ' +
                pr[0][k].info +
                '\n\n'
        }
        kdata += '\n'
    }

    // Return a complex context (this will be passed to the transformer for completion)
    return (
        (await database.instance.getContext())
            .toString()
            .replaceAll('$room', pr[3])
            .replaceAll('$morals', pr[4])
            .replaceAll('$ethics', pr[5])
            .replaceAll('$personality', pr[6])
            .replaceAll('$needsAndMotivations', pr[7])
            .replaceAll('$exampleDialog', pr[8])
            .replaceAll('$monologue', pr[9])
            .replaceAll('$facts', pr[10])
            // .replaceAll("$actions", fs.readFileSync(rootAgent + 'actions.txt').toString())
            .replaceAll('$speakerFacts', pr[1])
            .replaceAll('$agentFacts', pr[2])
            .replaceAll('$keywords', kdata)
            .replaceAll('$agent', agent)
            .replaceAll('$speaker', speaker)
            .replaceAll('$conversation', conversation)
    )
}
