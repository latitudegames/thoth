/* eslint-disable camelcase */
import axios from 'axios'
//handles the input from a client according to a selected agent and responds
export async function handleInput(
  message: string | undefined,
  speaker: string,
  agent: string,
  spell_handler = 'default',
  spell_version = 'latest'
) {
  const response = await axios.post(
    `http://localhost:8001/chains/${spell_handler}/${spell_version}`,
    {
      Input: {
        message,
        speaker,
        agent,
      },
    }
  )
  // Outputs are broken right now, so we are writing gamestate just in case
  return response.data.gameState.outputs ?? response.data.outputs
}
