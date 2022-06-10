import { authRequest } from './axios'

export const completion = async (request: Record<string, any>) => {
  try {
    const response = await authRequest({
      url: '/text/completions_v2',
      data: JSON.stringify(request),
    })

    console.log('response from completion', response)

    return response.data
  } catch (err) {
    console.log('Error in completion!')
    console.log('Err', err)
    return {}
  }
}
