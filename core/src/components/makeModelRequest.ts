/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { config } from 'dotenv'
import fetch from 'node-fetch'
config()

//Model Request using the Hugging Face API (models can be found at -> https://huggingface.co/models)
export async function makeModelRequest(
  inputs,
  model,
  parameters = {},
  options = { use_cache: false, wait_for_model: true }
) {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${(
            await database.instance.getConfig()
          )['hf_api_token'].replace(' ', '_')}`,
        },
        method: 'POST',
        body: JSON.stringify({ inputs, parameters, options }),
      }
    )
    return await response.json()
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}
