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
        console.log(
                'handleInput',
                message,
                speaker,
                agent,
        )
        const response = await axios.post(
                'http://localhost:8001/chains/default/latest',
                {
                        "TestInput": {
                                message,
                                speaker,
                                agent
                        },
                }
        )
        console.log("Response is", response)
        // Outputs are broken right now, so we are writing gamestate just in case
        return response.data.outputs ?? response.data.gameState.outputs
}
