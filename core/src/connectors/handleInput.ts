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
  const response = await axios.post(
    `http://localhost:8001/chains/${spell_handler}/${spell_version}`,
    {
      Input: {
        Input: message,
        Speaker: speaker,
        Agent: agent,
        Client: client,
        ChannelID: channelId,
      },
    }
  )
  console.log('response:', response.data.outputs)
  console.log('response1:', response.data.outputs.Greeting)
  // Outputs are broken right now, so we are writing gamestate just in case
  return response.data.outputs.Greeting
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
