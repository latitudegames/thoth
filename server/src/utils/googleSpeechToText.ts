import { SpeechClient } from '@google-cloud/speech'
import { Server } from 'socket.io'

let speechClient: SpeechClient
const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'en-US'

const request = {
  config: {
    encoding: encoding as any,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    profanityFilter: false,
    enableWordTimeOffsets: true,
    // speechContexts: [{
    //     phrases: ["hi","hello"]
    //    }]
  },
  interimResults: false,
}

export async function initSpeechServer() {
  if (process.env.ENABLE_SPEECH_SERVER === 'false') {
    return
  }

  const io = new Server(parseInt(process.env.SPEECH_SERVER_PORT as string), {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })
  console.log('speech server started on port', process.env.SPEECH_SERVER_PORT)

  speechClient = new SpeechClient()

  io.on('connection', function (client) {
    let recognizeStream: any = null

    client.on('join', function (data) {
      client.emit('messages', 'Client connected')
    })
    client.on('messages', function (data) {
      client.emit('broad', data)
    })

    client.on('startGoogleCloudStream', function (data) {
      startRecognitionStream(client)
    })
    client.on('endGoogleCloudStream', function (data) {
      stopRecognitionStream()
    })

    client.on('binaryData', function (data) {
      if (recognizeStream !== null) {
        recognizeStream.write(data)
      }
    })

    function startRecognitionStream(client: any) {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', err => {
          console.log(err)
        })
        .on('data', data => {
          client.emit('speechData', data)
          if (data.results[0] && data.results[0].isFinal) {
            stopRecognitionStream()
            startRecognitionStream(client)
          }
        })
    }

    function stopRecognitionStream() {
      if (recognizeStream) {
        recognizeStream.end()
      }
      recognizeStream = null
    }
  })
}
