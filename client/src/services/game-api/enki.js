/* eslint-disable no-console */
import { latitudeApiRootUrl } from '@/config'
import { getAuthHeader } from '../../contexts/NewAuthProvider'

export const getEnkiPrompt = async taskName => {
  try {
    const response = await fetch(url + `/enki/${taskName}`, {
      method: 'GET',
      prompt,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
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
    const response = await fetch(url + `/enki`, {
      method: 'GET',
      prompt,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
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
    const response = await fetch(url + `/enki/${taskName}/completion`, {
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
