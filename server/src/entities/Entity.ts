import discord_client from './connectors/discord'
import { telegram_client } from './connectors/telegram'
import { zoom_client } from './connectors/zoom'
import { twitter_client } from './connectors/twitter'
import { reddit_client } from './connectors/reddit'
import { instagram_client } from './connectors/instagram'
import { messenger_client } from './connectors/messenger'
import { whatsapp_client } from './connectors/whatsapp'
import { twilio_client } from './connectors/twilio'
//import { harmony_client } from '../../../core/src/connectors/harmony'
import { xrengine_client } from './connectors/xrengine'

async function handleInput(
  message: string | undefined,
  speaker: string,
  agent: string,
  client: string,
  channelId: string,
  entity: number,
  spell_handler: string,
  spell_version: string = 'latest'
) {
  if (spell_handler === undefined) {
    spell_handler = 'default'
  }
  if (spell_version === undefined) {
    spell_version = 'latest'
  }

  const url = encodeURI(
    `http://localhost:8001/chains/${spell_handler}/${spell_version}`
  )

  const response = await axios.post(`${url}`, {
    Input: {
      Input: message,
      Speaker: speaker,
      Agent: agent,
      Client: client,
      ChannelID: channelId,
      Entity: entity,
    },
  })
  let index = undefined

  for (const x in response.data.outputs) {
    index = x
  }

  if (index && index !== undefined) {
    return response.data.outputs[index]
  } else {
    return undefined
  }
}

export class Entity {
  name = ''

  //Clients
  discord: discord_client | null
  telegram: telegram_client
  zoom: zoom_client
  twitter: twitter_client
  reddit: reddit_client
  instagram: instagram_client
  messenger: messenger_client
  whatsapp: whatsapp_client
  twilio: twilio_client
  //harmony: any
  xrengine: xrengine_client
  id: any

  startDiscord(
    discord_api_token: string,
    discord_starting_words: string,
    discord_bot_name_regex: string,
    discord_bot_name: string,
    discord_empty_responses: string,
    entity: string,
    spell_handler: string,
    spell_version: string
  ) {
    console.log('initializing discord, spell_handler:', spell_handler)
    if (this.discord)
      throw new Error('Discord already running for this agent on this instance')

    // TODO:
    // 1. Create new thoth graph
    // 2. create a thoth graph handler function
    // 3. set this handle message function to it
    // 4. change handlemessage calls to use this function


    this.discord = new discord_client()
    this.discord.createDiscordClient(
      this,
      discord_api_token,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      discord_empty_responses,
      entity,
      spell_handler
    )
    console.log('Started discord client for agent ' + this.name)
  }

  stopDiscord() {
    if (!this.discord) throw new Error("Discord isn't running, can't stop it")
    this.discord.destroy()
    this.discord = null
    console.log('Stopped discord client for agent ' + this.name)
  }

  startXREngine(settings: {
    entity: any
    url: string
    spell_handler: string
    spell_version: string
    xrengine_bot_name: string
    xrengine_bot_name_regex: string
    xrengine_starting_words: string
    xrengine_empty_responses: string
  }) {
    if (this.xrengine)
      throw new Error(
        'XREngine already running for this agent on this instance'
      )
    this.xrengine = new xrengine_client()
    this.xrengine.createXREngineClient(this, settings, this.xrengine)
    console.log('Started xrengine client for agent ' + this.name)
  }

  stopXREngine() {
    if (!this.xrengine) throw new Error("XREngine isn't running, can't stop it")
      ; (this.xrengine as any) = null
    console.log('Stopped xrengine client for agent ' + this.name)
  }

  async onDestroy() {
    if (this.discord) this.stopDiscord()
  }

  constructor(data: any) {
    this.id = data.id
    console.log('initing agent')
    console.log('agent data is ', data)
    this.name = data.agent ?? data.name ?? 'agent'

    if (data.discord_enabled) {
      this.startDiscord(
        data.discord_api_key,
        data.discord_starting_words,
        data.discord_bot_name_regex,
        data.discord_bot_name,
        data.discord_empty_responses,
        data,
        data.discord_spell_handler_incoming,
        data.spell_version
      )
    }

    if (data.xrengine_enabled) {
      this.startXREngine({
        url: data.xrengine_url,
        entity: data,
        spell_handler: data.xrengine_spell_handler_incoming,
        spell_version: data.spell_version,
        xrengine_bot_name: data.xrengine_bot_name,
        xrengine_bot_name_regex: data.xrengine_bot_name_regex,
        xrengine_starting_words: data.xrengine_starting_words,
        xrengine_empty_responses: data.xrengine_empty_responses,
      })
    }
  }

  // TODO: Fix me

  // for (let i = 0; i < clients.length; i++) {
  //   if (clients[i].enabled === 'true') {
  //     if (clients[i].client === 'discord') {
  //       this.discord = new discord_client()
  //       this.discord.createDiscordClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'telegram') {
  //       this.telegram = new telegram_client()
  //       this.telegram.createTelegramClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'zoom') {
  //       this.zoom = new zoom_client()
  //       this.zoom.createZoomClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'twitter') {
  //       this.twitter = new twitter_client()
  //       this.twitter.createTwitterClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'reddit') {
  //       this.reddit = new reddit_client()
  //       this.reddit.createRedditClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'instagram') {
  //       this.instagram = new instagram_client()
  //       this.instagram.createInstagramClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'messenger') {
  //       this.messenger = new messenger_client()
  //       this.messenger.createMessengerClient(app, this, clients[i].settings)
  //     } else if (clients[i].client === 'whatsapp') {
  //       this.whatsapp = new whatsapp_client()
  //       this.whatsapp.createWhatsappClient(this, clients[i].settings)
  //     } else if (clients[i].client === 'twilio') {
  //       this.twilio = new twilio_client()
  //       this.twilio.createTwilioClient(app, router, this, clients[i].settings)
  //     } else if (clients[i].client === 'harmony') {
  //       //this.harmony = new harmony_client();
  //       //this.harmony.createHarmonyClient(this, clients[i].settings);
  //     }
  //   }
  // }
}

export default Entity
