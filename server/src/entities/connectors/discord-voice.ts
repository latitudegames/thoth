// @ts-nocheck
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
} from '@discordjs/voice'
import { tts } from '../../systems/googleTextToSpeech'
import { getAudioUrl } from "../../routes/getAudioUrl"
import { addSpeechEvent } from './voiceUtils/addSpeechEvent'

//const transcriber = new Transcriber('288916776772018')
export function initSpeechClient(
    client,
    discord_bot_name,
    entity,
    handleInput,
    voiceProvider,
    voiceCharacter,
    languageCode?
) {
    addSpeechEvent(client)

    client.on('speech', async msg => {
        console.log("msg is ", msg)
        const content = msg.content
        const connection = msg.connection
        const author = msg.author
        const channel = msg.channel

        console.log('got voice input:', content)
        if (content) {
            const response = await handleInput(
                content,
                author?.username ?? 'VoiceSpeaker',
                discord_bot_name,
                'discord',
                channel.id,
                entity
            )
            console.log("response is", response)
            if (response) {
                const audioPlayer = createAudioPlayer()

                // TODO
                // 1. get the voice provider
                // if google, use that
                // otherwise use uberduck
                // 2. set the character name from the request
                let url;

                if (voiceProvider === 'uberduck') {
                    url = await getAudioUrl(
                        process.env.UBER_DUCK_KEY as string,
                        process.env.UBER_DUCK_SECRET_KEY as string,
                        voiceCharacter,
                        response as string
                    )
                } else { // google tts
                    url = await tts(response, voiceProvider, voiceCharacter, languageCode)
                }

                // const url = await tts(response)
                connection.subscribe(audioPlayer)
                console.log('speech url:', url)
                if (url) {

                    const audioResource = createAudioResource(url, {
                        inputType: StreamType.Arbitrary,
                    })
                    audioPlayer.play(audioResource)
                }
            }
        }
    })
}

/**
 * Join the voice channel and start listening.
 * @param {Discord.Receiver} receiver
 * @param {Discord.TextChannel} textChannel
 */
export async function recognizeSpeech(textChannel) {
    console.log('recognizeStream')
    if (textChannel) {
        joinVoiceChannel({
            channelId: textChannel.id,
            guildId: textChannel.guild.id,
            adapterCreator: textChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
        })
    }
}
