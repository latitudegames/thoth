// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

// TODO: Turn into a node

import { database } from '../connectors/database'
import { makeCompletionRequest } from './makeCompletionRequest'

export async function summarizeAndStoreFactsAboutAgent(speaker, agent, input) {
    const agentFactSummarizationPrompt = (await database.instance.getConfig())[
        'fact_summarization'
    ]
        .toString()
        .split('\n')

    // Take the input and send out a summary request
    const prompt = agentFactSummarizationPrompt
        .join('\n')
        .replaceAll('$speaker', speaker)
        .replaceAll('$agent', agent)
        .replaceAll('$example', input)

    const data = {
        prompt: prompt,
        temperature: 0.0,
        max_tokens: 20,
        top_p: 1,
        frequency_penalty: 0.8,
        presence_penalty: 0.3,
        stop: ['"""'],
    }

    const { success, choice } = await makeCompletionRequest(
        data,
        speaker,
        agent,
        'agent_facts',
        'davinci'
    )
    if (success && choice.text != '' && !choice.text.includes('no facts')) {
        database.instance.setAgentFacts(
            agent,
            (agent + ': ' + choice.text + '\n').replace('\n\n', '\n')
        )
    }
}
