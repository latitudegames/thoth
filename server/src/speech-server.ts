import { config } from 'dotenv-flow'
config()
import { initSpeechServer } from './systems/googleSpeechToText'

initSpeechServer(false)
