const { EndBehaviorType, VoiceReceiver } = require('@discordjs/voice')
const { pipeline, Readable } = require('stream')
const witClient = require('node-witai-speech')
const prism = require('prism-media')
const util = require('util')
const fs = require('fs')

class Transcriber {
  WITAPIKEY: any
  witAI_lastcallTS: any

  constructor(apiKey: string) {
    this.WITAPIKEY = apiKey
    this.witAI_lastcallTS = null

    return this
  }

  sleep(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  async convert_audio(input: any) {
    try {
      // stereo to mono channel
      const data = new Int16Array(input)
      const ndata = new Int16Array(data.length / 2)
      for (let i = 0, j = 0; i < data.length; i += 4) {
        ndata[j++] = data[i]
        ndata[j++] = data[i + 1]
      }
      return Buffer.from(ndata)
    } catch (e) {
      console.log('convert_audio: ', e)
      throw e
    }
  }

  async transcribe(buffer: any, raw: any) {
    try {
      if (this.witAI_lastcallTS != null) {
        let now = Math.floor(Date.now())
        while (now - this.witAI_lastcallTS < 1000) {
          await this.sleep(100)
          now = Math.floor(Date.now())
        }
      }
      const extractSpeechIntent = util.promisify(witClient.extractSpeechIntent)
      var stream = Readable.from(buffer)
      const contenttype =
        'audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little'
      var output = await extractSpeechIntent(
        this.WITAPIKEY,
        stream,
        contenttype
      )
      this.witAI_lastcallTS = Math.floor(Date.now())
      if (raw) return output
      if (typeof output == 'object') return output
      output = output
        .split('\n')
        .map((item: string) => item.trim())
        .join('')
      let idx = output.lastIndexOf('}{')
      let idx0 = output.lastIndexOf('}')
      output = JSON.parse(
        output
          .substring(idx + 1, idx0 + 1)
          .trim()
          .replace(/\n/g, '')
          .trim()
      )
      output.text = output.text.replace(/\./g, '')
      stream.destroy()
      return output
    } catch (e) {
      console.log('Transcriber-error: ', e)
      return {}
    }
  }

  listen(receiver: any, userId: any) {
    return new Promise(async (res, rej) => {
      const stream = receiver.subscribe(userId, {
        end: {
          behavior: EndBehaviorType.AfterSilence,
          duration: 300,
        },
      })

      const decoder = new prism.opus.Decoder({
        frameSize: 960,
        channels: 2,
        rate: 48000,
      })
      stream.pipe(decoder)

      let buffer: any = []
      decoder.on('data', (data: any) => {
        buffer.push(data)
      })
      decoder.on('end', async () => {
        buffer = Buffer.concat(buffer)
        const duration = buffer.length / 48000 / 2
        if (duration > 1.0 || duration < 19) {
          let transcript = await this.transcribe(
            await this.convert_audio(buffer),
            null
          )
          res({ transcript: transcript })
        }
      })
    })
  }
}

export default Transcriber
