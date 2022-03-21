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
  spell_handler: string,
  spell_version: string = 'latest'
) {
  const url = encodeURI(
    `http://localhost:8001/chains/${spell_handler}/${spell_version}`
  )

  const response = await axios.post(`${url}`, {
    Input: {
      Input: message,
      Speaker: speaker,
      Agent: agent,
      Client: client,
      ChannelID: channelId,
    },
  })
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
