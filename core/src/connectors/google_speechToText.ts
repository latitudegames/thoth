/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import textToSpeech from '@google-cloud/text-to-speech'

export default async function getSpeechForText() {
  // const textToSpeechClient = new textToSpeech.TextToSpeechClient({
  //   projectId: process.env.google_project_id,
  // })

  /*const request = {
    input: {
      text: responseText,
    },
  }
  // // Talk faster when long gpt3 response
  // if (responseText.length > 140) {
  //     request.audioConfig.speakingRate = 1.1;
  // }
  // if (responseText.length > 340) {
  //     request.audioConfig.speakingRate = 1.3;
  // }

  const [newresponse] = await textToSpeechClient.synthesizeSpeech(request)

  await writeFile(
    path.join(rootDir, `/clips/${uid}.mp3`),
    newresponse.audioContent,
    'binary'
  )

  return path.join(rootDir, `/clips/${uid}.mp3`)*/
}
