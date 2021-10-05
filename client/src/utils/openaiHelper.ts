import {
  ModelCompletionOpts,
  OpenAIResultChoice,
} from '@latitudegames/thoth-core/types'

export const completion = async (body: ModelCompletionOpts) => {
  const url = process.env.REACT_APP_API_URL

  try {
    const response = await fetch(url + '/ml/text/completions', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_GAME_KEY || '',
      },
      body: JSON.stringify({ ...body, prompt: body.prompt?.trimEnd() }),
    })
    const parsedResponse = await response.json()
    const { result }: { result: OpenAIResultChoice | string } = parsedResponse
    return result
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('fetch error', err)
  }
}
