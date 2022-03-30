/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import axios from 'axios'

//Model Request using the Hugging Face API (models can be found at -> https://huggingface.co/models)
export async function makeModelRequest(
    inputs,
    model,
    parameters = {},
    options = { use_cache: false, wait_for_model: false }
) {
    console.log("making model request")
    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            { inputs, parameters, options },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                },
            }
        )
        console.log("Response on server is", response)
        return { success: true, data: response.data }
    } catch (err) {
        console.error(err)
        return { success: false, data: err }
    }
}