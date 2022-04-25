// @ts-nocheck
import Discord from 'discord.js';
import fs from 'fs';
import child_process from 'child_process';
import { v1p1beta1 } from '@google-cloud/speech'
const execFile = child_process.execFile

const speech = v1p1beta1
const speechClient = new speech.SpeechClient({
    keyFilename: 'google-cloud.credentials.json'
})

/**
 * Join the voice channel and start listening.
 * @param {Discord.Receiver} receiver
 * @param {Discord.TextChannel} textChannel
 */
export async function recognizeSpeech(receiver, callback, textChannel: Discord.TextChannel) {
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
    function getRecognizer(user) {
        if (recognizers.has(user)) {
            return recognizers.get(user)
        }
        const recognizer = createRecognizer(user)
        recognizers.set(user, recognizer)
        return recognizer
    }

    /**
     * Creates a new Recognizer for the user.
     * The recognizer will self-destruct when user stopped speaking for 500ms.
     * @param {Discord.User} user
     */
    function createRecognizer(user) {
        const hash = require('crypto').createHash('sha256')
        hash.update(`${user}`)
        const obfuscatedId = parseInt(hash.digest('hex').substr(0, 12), 16)

        /**
         * Raw PCM data from discord.js will be written to this file.
         */
        const tmpFile = '.tmp/input' + Date.now() + '.s32'

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
            }
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
            try {
                const audio = await saveAndConvertAudio() as any
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
                        sampleRateHertz: 16000,
                        languageCode: "en_US",
                        maxAlternatives: 1,
                        profanityFilter: false,
                        metadata: {
                            interactionType: 'PHONE_CALL',
                            obfuscatedId
                        },
                        model: 'default',
                        useEnhanced: true,
                        enableAutomaticPunctuation: true
                    }
                })
                if (data.results) {
                    for (const result of data.results) {
                        const alt = result.alternatives && result.alternatives[0]
                        if (alt && alt.transcript) {
                            if (textChannel)
                                textChannel.send(`${user}: ${alt.transcript}`)
                            if (callback)
                                callback(alt.transcript)
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
                        ...['-t', 's16', '-r', '16000', '-c', '1', '-']
                    ],
                    {
                        maxBuffer: 20 * 1048576,
                        encoding: 'buffer'
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

    receiver.on('pcm', (user, buffer) => {
        getRecognizer(user).handleBuffer(buffer)
    })
}