/* eslint-disable no-console */
import { getAuthHeader } from '../../utils/authHelper'

const url = process.env.REACT_APP_API_URL

export const getEnkiPrompt = async taskName => {
  try {
    const response = await fetch(url + `/tools/enki/${taskName}`, {
      method: 'GET',
      prompt,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const parsed = await response.json()

    return parsed
  } catch (err) {
    console.warn('fetch error', err)
  }
}

export const getEnkis = async () => {
  try {
    const response = await fetch(url + `/tools/enki`, {
      method: 'GET',
      prompt,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const parsed = await response.json()

    return parsed
  } catch (err) {
    console.warn('fetch error', err)
  }
}

export const postEnkiCompletion = async (taskName, inputs) => {
  try {
    const response = await fetch(url + `/tools/enki/${taskName}/completion`, {
      method: 'POST',
      prompt,
      mode: 'cors',
      body: JSON.stringify({ inputs }),
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })

    const parsed = await response.json()

    return parsed
  } catch (err) {
    console.warn('fetch error', err)
  }
}
