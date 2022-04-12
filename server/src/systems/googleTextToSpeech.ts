import { protos } from '@google-cloud/speech'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import * as fs from 'fs'
import util from 'util'

let client: TextToSpeechClient

export async function initTextToSpeech() {
  client = new TextToSpeechClient()
}

export async function tts(input: string) {
  const ttsRequest = {
    input: { text: input },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Wavenet-F',
      ssmlGender: 1 /*Male*/,
    },
    audioConfig: { audioEncoding: 2 /*MP3*/ },
  }

  console.log('GENERATING VOICEEEEEEEEEEEEE')

  const outputFile = 'test.mp3'
  const [response] = await client.synthesizeSpeech(ttsRequest)
  const writeFile = util.promisify(fs.writeFile)
  await writeFile(outputFile, response.audioContent as string, 'binary')
  console.log(`Audio content written to file: ${outputFile}`)
  // [END tts_synthesize_text_file]
}
