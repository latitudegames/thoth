import { getAuthHeader } from '../../utils/authHelper'

export const completion = async body => {
  const url = process.env.REACT_APP_API_URL

  try {
    const response = await fetch(url + '/text/completions', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ ...body, prompt: body.prompt.trimEnd() }),
    })
    const { result } = await response.json()
    return result
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('fetch error', err)
  }
}
