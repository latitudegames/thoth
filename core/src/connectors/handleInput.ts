// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import axios from 'axios'
//handles the input from a client according to a selected agent and responds
export async function handleInput(
        message,
        speaker,
        agent,
        res,
        clientName,
        channelId
) {
        const response = await axios.post(
                'http://localhost:8001/chains/default/latest',
                {
                        "Input": {
                                message,
                                speaker,
                                agent
                        },
                }
        )
        // Outputs are broken right now, so we are writing gamestate just in case
        return response.data.gameState.outputs ?? response.data.outputs
}
