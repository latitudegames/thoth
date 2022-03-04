import { latitudeApiRootUrl } from '@/config'
import { getAuthHeader } from '../../contexts/NewAuthProvider'

export const completion = async body => {
  try {
    const response = await fetch(latitudeApiRootUrl + '/text/completions', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
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
