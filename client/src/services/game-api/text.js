import { getAuthHeader } from '../../utils/authHelper'

export const completion = async body => {
  const url = process.env.REACT_APP_API_URL

  try {
    const response = await fetch(url + '/ml/text/completions', {
      method: 'POST',
      prompt,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ ...body, prompt: body.prompt.trimEnd() }),
    })
    const parsedResponse = await response.json()
    const { result } = parsedResponse
    return result
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('fetch error', err)
  }
}
