// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import axios from 'axios'

import { database } from '../connectors/database'
import { makeModelRequest } from './makeModelRequest'

export async function makeCompletionRequest(
  data,
  speaker,
  agent,
  type,
  engine,
  log = true
) {
  if ((await database.instance.getConfig())['use_gptj']) {
    const params = {
      temperature: 0.8,
      repetition_penalty: 0.5,
      max_length: 500,
      return_full_text: false,
      max_new_tokens: 150,
    }
    const options = {
      wait_for_model: true,
    }
    const response = await makeModelRequest(
      data.prompt,
      'EleutherAI/gpt-j-6B',
      params,
      options
    )
    console.log('response', response.body)
    const responseModified = {
      success: true,
      choice: { text: response[0].generated_text.split('\n')[0] },
    }
    return responseModified
  } else {
    return await makeOpenAIGPT3Request(data, speaker, agent, type, engine)
  }
}
const useDebug = false
async function makeOpenAIGPT3Request(
  data,
  speaker,
  agent,
  type,
  engine,
  log = true
) {
  if (useDebug) return { success: true, choice: { text: 'Default response' } }
  const API_KEY =
    process.env.OPENAI_API_KEY ??
    (await database.instance.getConfig())['openai_api_key']
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  }
  try {
    const gptEngine = engine ?? 'davinci'
    const resp = await axios.post(
      `https://api.openai.com/v1/engines/${gptEngine}/completions`,
      data,
      { headers: headers }
    )

    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0]
      return { success: true, choice }
    }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}
