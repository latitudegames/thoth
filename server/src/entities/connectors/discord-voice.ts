// @ts-nocheck
import Discord from 'discord.js'
import fs from 'fs'
import child_process from 'child_process'
import { v1p1beta1 } from '@google-cloud/speech'
import { joinVoiceChannel } from '@discordjs/voice'
import os from 'os'
import {
  convertBufferTo1Channel,
  ConvertTo1ChannelStream,
} from '../../utils/convertBufferTo1Channel'
import Transcriber from '../../utils/transcriber'

const execFile = child_process.execFile

const speech = v1p1beta1
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})
const transcriber = new Transcriber('288916776772018')

/**
 * Join the voice channel and start listening.
 * @param {Discord.Receiver} receiver
 * @param {Discord.TextChannel} textChannel
 */
export async function recognizeSpeech(
  //   receiver,
  callback,
  textChannel,
  author
) {
  const connection = joinVoiceChannel({
    channelId: textChannel.id,
    guildId: textChannel.guild.id,
    selfDeaf: false,
    selfMute: false,
    adapterCreator: textChannel.guild.voiceAdapterCreator,
  })
  const receiver = connection.receiver
  console.log('author.id:', author.id)

  receiver.speaking.on('start', userId => {
    console.log('speaker started talking')
    transcriber.listen(receiver, userId).then(data => {
      console.log('transcription data:', data)
    })
  })
  /*
  const userStream = receiver.subscribe(author.id, {
    mode: 'pcm',
    // end: 'silence',
  })
  console.log('receiver speaking :::: ', receiver.speaking)

  userStream.on('data', (chunk: string | boolean) => {
    //console.log('------on data------')
    //console.log(chunk)
    getRecognizer(author.id, userStream).handleBuffer(chunk)
  })

  userStream.on('end', () => {
    console.log('------on finish------')
  })*/

  /**
   * Map of active recognizers.
   * @type {Map<Discord.User, ReturnType<typeof createRecognizer>>}
   */
  const recognizers = new Map()

  /**
   * Returns a recognizer for a specified user, creating a new one if
   * necessary.
   * @param {Discord.User} user
   * @returns {ReturnType<typeof createRecognizer>}
   */
  function getRecognizer(user, dStream) {
    if (recognizers.has(user)) {
      return recognizers.get(user)
    }
    const recognizer = createRecognizer(user, dStream)
    recognizers.set(user, recognizer)
    return recognizer
  }

  /**
   * Creates a new Recognizer for the user.
   * The recognizer will self-destruct when user stopped speaking for 500ms.
   * @param {Discord.User} user
   */
  function createRecognizer(user, dstream) {
    const requestConfig = {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
    }
    const request = {
      config: requestConfig,
    }
    const recognizeStream = speechClient
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', response => {
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n')
          .toLowerCase()
        console.log(`Transcription: ${transcription}`)
      })
    const convertTo1ChannelStream = new ConvertTo1ChannelStream()
    dstream.pipe(convertTo1ChannelStream).pipe(recognizeStream)
    recognizeStream.on('data', data => {
      console.log('data', data)
    })
    const hash = require('crypto').createHash('sha256')
    hash.update(`${user}`)
    const obfuscatedId = parseInt(hash.digest('hex').substr(0, 12), 16)

    /**
     * Raw PCM data from discord.js will be written to this file.
     */
    const tmpFile = os.tmpdir() + '/input' + Date.now() + '.s32'

    /**
     * Write stream for raw PCM data from discord.js.
     */
    const writeStream = fs.createWriteStream(tmpFile)

    /**
     * This promise will be resolved when writeStream is closed.
     */
    const written = new Promise((resolve, reject) => {
      writeStream.on('error', reject)
      writeStream.on('close', resolve)
    })

    /**
     * Timer from handling of a buffer to ending the stream.
     * @type {NodeJS.Timer}
     */
    let timeout: NodeJS.Timeout
    const start = Date.now()
    const recognizer = {
      /**
       * @param {Buffer} buffer
       */
      handleBuffer(buffer: any) {
        clearTimeout(timeout)
        writeStream.write(buffer)
        timeout = setTimeout(endStream, Date.now() - start > 10000 ? 500 : 2000)
      },
    }

    let ended = false
    /**
     * Ends the stream and self-destruct the recognizer.
     */
    function endStream() {
      if (ended) return
      ended = true
      recognizers.delete(user)
      console.log(
        { activeRecognizers: recognizers.size },
        `Ended stream for ${user}.`
      )
      transcribe()
    }

    /**
     * Transcribe the heard audio into text, and post it.
     */
    async function transcribe() {
      return
      try {
        console.log('transcribing')
        const audio = (await saveAndConvertAudio()) as any
        const audioLength = audio.length / 2 / 16000
        const duration = audioLength.toFixed(2)
        if (audioLength < 1) {
          console.log(
            `${user} (oid=${obfuscatedId}) spake for ${duration} seconds`
          )
        }
        const [data] = await speechClient.recognize({
          audio: { content: audio.toString('base64') },
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 48000,
            languageCode: 'en_US',
          },
        })
        console.log('data.results:', data.results)
        if (data.results) {
          for (const result of data.results) {
            const alt = result.alternatives && result.alternatives[0]
            if (alt && alt.transcript) {
              if (textChannel) textChannel.send(`${user}: ${alt.transcript}`)
              if (callback) callback(alt.transcript)
              console.log(`Recognized from ${user}: “${alt.transcript}”`)
            }
          }
        }
      } catch (e) {
        console.error(e, 'Failed to recognize')
      }
    }

    /**
     * Finish writing to tmpFile and convert it to format suitable
     * for Google Cloud Speech-To-Text API.
     */
    async function saveAndConvertAudio() {
      writeStream.end()
      await written
      return new Promise((resolve, reject) => {
        execFile(
          'sox',
          [
            ...['-t', 's32', '-r', '48000', '-c', '1', tmpFile],
            ...['-t', 's16', '-r', '16000', '-c', '1', '-'],
          ],
          {
            maxBuffer: 20 * 1048576,
            encoding: 'buffer',
          },
          (error, stdout) => {
            if (error) return reject(error)
            resolve(stdout)
            fs.unlink(tmpFile, err => {
              if (err) {
                console.error(err, 'Cannot cleanup temp file.')
              }
            })
          }
        )
      })
    }

    console.log(
      { activeRecognizers: recognizers.size },
      `Starting voice recognition for ${user} (oid=${obfuscatedId})...`
    )
    return recognizer
  }
}
