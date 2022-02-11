/* eslint-disable no-console */
import axios from 'axios'

export async function storeFacts(
  agent: string,
  speaker: string,
  facts: string
) {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/facts`, {
    agent: agent,
    speaker: speaker,
    facts: facts,
  })

  console.log(response.data)
}

export async function getFacts(agent: string, speaker: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/facts?agent=${agent}&speaker=${speaker}`
  )
  return response.data
}

export async function getFactsCount(agent: string, speaker: string) {
  console.log('sending facts count')
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/facts_count?agent=${agent}&speaker=${speaker}`
  )

  let count = 0

  try {
    count = parseInt(response.data)
  } catch (e) {
    console.log(e)
  }

  return count
}
