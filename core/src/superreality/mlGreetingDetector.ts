// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'

import { makeModelRequest } from '../components/makeModelRequest'

export async function mlGreetingDetector(input: string) {
  if (customConfig.instance.get('hf_api_token')) {
    const parameters: string[] = ['Greeting', 'Not Greeting']
    const result = await makeModelRequest(
      input,
      'facebook/bart-large-mnli',
      parameters
    )
    console.log(result)
  } else {
    console.log('no hf key')
  }

  return true
}
