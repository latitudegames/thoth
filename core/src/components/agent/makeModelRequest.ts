/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import axios from 'axios'

//Model Request using the Hugging Face API (models can be found at -> https://huggingface.co/models)
export async function makeModelRequest(
  inputs,
  model,
  parameters = {},
  options = { use_cache: false, wait_for_model: true }
) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs, parameters, options },
      {
        headers: {
          Authorization: `Bearer ${(
            await database.instance.getConfig()
          )['hf_api_token'].replace(' ', '_')}`,
        },
      }
    )
    return await response.data
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}
