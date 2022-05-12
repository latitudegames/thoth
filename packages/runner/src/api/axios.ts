import axios from 'axios'
import { LATITUDE_API_KEY, LATITUDE_API_URL } from '../config'

export const authRequest = axios.create({
  baseURL: LATITUDE_API_URL,
  headers: {
    'x-api-key': LATITUDE_API_KEY,
  },
})
