/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
// import speech from '@google-cloud/speech'

export default async function getTextForSpeech() {
  // const client = new speech.SpeechClient()

  // const request = {
  //   config: {
  //     encoding: 'LINEAR16',
  //     sampleRateHertz: 16000,
  //     languageCode: 'en-US',
  //   },
  //   interimResults: false,
  //   languageCode: 'en-GB',
  // }

  /*const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data =>
      process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : '\n\nReached transcription time limit, press Ctrl+C\n'
      )
    )*/

  /*const str = new stream();
    stream.pipe(recognizeStream);*/
}
