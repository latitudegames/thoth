// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { database } from '../superreality/database'
import { makeCompletionRequest } from './makeCompletionRequest'

export async function summarizeAndStoreFactsAboutSpeaker(
    speaker,
    agent,
    input
) {
    const { summarizationModel } = JSON.parse(
        (await database.instance.getAgentsConfig('common')).toString()
    )

    const speakerFactSummarizationPrompt = (
        await database.instance.getSpeakerFactSummarization('common')
    )
        .toString()
        .replace('\n\n', '\n')

    // Take the input and send out a summary request
    const prompt = speakerFactSummarizationPrompt
        .replaceAll('$speaker', speaker)
        .replaceAll('$agent', agent)
        .replaceAll('$example', input)

    const data = {
        prompt: prompt,
        temperature: 0.3,
        max_tokens: 20,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ['"""', '\n'],
    }

    const { success, choice } = await makeCompletionRequest(
        data,
        speaker,
        agent,
        'speaker_facts',
        summarizationModel
    )
    if (success && choice.text != '' && !choice.text.includes('no facts')) {
        await database.instance.setSpeakersFacts(
            agent,
            speaker,
            (speaker + ': ' + choice.text + '\n').replace('\n\n', '\n')
        )
    }
}
