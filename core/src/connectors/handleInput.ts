/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import axios from 'axios'
//handles the input from a client according to a selected agent and responds
export async function handleInput(
  message: string | undefined,
  speaker: string,
  agent: string,
  client: string,
  channelId: string,
  spell_handler = 'default',
  spell_version = 'latest'
) {
  if (!spell_handler || spell_handler === undefined) {
    spell_handler = 'default'
  }
  if (!spell_version || spell_version === undefined) {
    spell_version = 'latest'
  }

  console.log('sending message', message)
  console.log('speaker agent client', speaker, agent, client)
  const url = encodeURI(
    `http://localhost:8001/chains/${spell_handler}/${spell_version}`
  )
  console.log('url is', url)
  const response = await axios.post(`${url}`, {
    Input: {
      Input: message,
      Speaker: speaker,
      Agent: agent,
      Client: client,
      ChannelID: channelId,
    },
  })
  console.log('data:', response.data)
  console.log('response:', response.data.outputs)
  let index = undefined

  for (const x in response.data.outputs) {
    index = x
  }

  if (index && index !== undefined) {
    return response.data.outputs[index]
  } else {
    return undefined
  }
}

export async function handleCustomInput(
  message: string,
  sender: string,
  isVoice: boolean,
  agent: string = 'Thales'
) {
  const response = await axios.post(`http://localhost:8001/custom_message`, {
    message: message,
    sender: sender,
    agent: agent,
    isVoice: isVoice,
  })

  return response.data.response
}
