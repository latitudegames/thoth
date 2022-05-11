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
import { CreateSpellHandler } from './CreateSpellHandler'

export class Entity {
  name = ''
  //Clients
  discord: discord_client | null
  telegram: telegram_client
  zoom: zoom_client
  twitter: twitter_client | null
  reddit: reddit_client
  instagram: instagram_client
  messenger: messenger_client
  whatsapp: whatsapp_client
  twilio: twilio_client
  //harmony: any
  xrengine: xrengine_client
  id: any

  async startDiscord(
    discord_api_token: string,
    discord_starting_words: string,
    discord_bot_name_regex: string,
    discord_bot_name: string,
    discord_empty_responses: string,
    spell_handler: string,
    spell_version: string,
    use_voice: boolean,
    voice_provider: string,
    voice_character: string,
    voice_language_code: string
  ) {
    console.log('initializing discord, spell_handler:', spell_handler)
    if (this.discord)
      throw new Error('Discord already running for this agent on this instance')

    const spellHandler = await CreateSpellHandler({
      spell: spell_handler,
      version: spell_version,
    })

    this.discord = new discord_client()
    console.log('createDiscordClient')
    await this.discord.createDiscordClient(
      this,
      discord_api_token,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      discord_empty_responses,
      spellHandler,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code
    )
    console.log('Started discord client for agent ' + this.name)
    // const response = await spellHandler(
    //   'testmessage',
    //   'testsender',
    //   'testbot',
    //   'discord',
    //   "0",
    //   this.id
    // )
    // console.log("response is ", response)
  }

  async stopDiscord() {
    if (!this.discord) throw new Error("Discord isn't running, can't stop it")
    await this.discord.destroy()
    this.discord = null
    console.log('Stopped discord client for agent ' + this.name)
  }

  async startXREngine(settings: {
    entity: any
    url: string
    spell_handler: string
    spell_version: string
    xrengine_bot_name: string
    xrengine_bot_name_regex: string
    xrengine_starting_words: string
    xrengine_empty_responses: string
    handleInput?: any
    use_voice: boolean
    voice_provider: string
    voice_character: string
    voice_language_code: string
  }) {
    if (this.xrengine)
      throw new Error(
        'XREngine already running for this agent on this instance'
      )

    const spellHandler = await CreateSpellHandler({
      spell: settings.spell_handler,
      version: settings.spell_version,
    })

    settings.handleInput = spellHandler

    this.xrengine = new xrengine_client()
    this.xrengine.createXREngineClient(
      this,
      settings,
      this.xrengine,
      spellHandler
    )
    console.log('Started xrengine client for agent ' + this.name)
  }

  stopXREngine() {
    if (!this.xrengine) throw new Error("XREngine isn't running, can't stop it")
    this.xrengine.destroy()
    ;(this.xrengine as any) = null
    console.log('Stopped xrengine client for agent ' + this.name)
  }

  async startTwitter(
    twitter_token: any,
    twitter_id: any,
    twitter_app_token: any,
    twitter_app_token_secret: any,
    twitter_access_token: any,
    twitter_access_token_secret: any,
    twitter_bot_name: any,
    twitter_bot_name_regex: any
  ) {
    console.log('initializing Twitter:', twitter_token)
    if (this.twitter)
      throw new Error(
        'Twitter already running for this entity on this instance'
      )

    // const spellHandler = await CreateSpellHandler({
    //   spell: spell_handler,
    //   version: spell_version,
    // })

    this.twitter = new twitter_client()
    console.log('createDiscordClient')
    await this.twitter.createTwitterClient(this, {
      twitter_token,
      twitter_id,
      twitter_app_token,
      twitter_app_token_secret,
      twitter_access_token,
      twitter_access_token_secret,
      twitter_bot_name,
      twitter_bot_name_regex,
    })
    console.log('Started twitter client for agent ' + this)
    // const response = await spellHandler(
    //   'testmessage',
    //   'testsender',
    //   'testbot',
    //   'discord',
    //   "0",
    //   this.id
    // )
    // console.log("response is ", response)
  }

  stopTwitter() {
    if (!this.discord) throw new Error("Twitter isn't running, can't stop it")
    this.twitter = null
    console.log('Stopped twitter client for agent ' + this)
  }

  async onDestroy() {
    console.log(
      'CLOSING ALL CLIENTS, discord is defined:,',
      this.discord === null || this.discord === undefined
    )
    if (this.discord) this.stopDiscord()
    if (this.xrengine) this.stopXREngine()
    if (this.twitter) this.stopTwitter()
  }

  constructor(data: any) {
    this.onDestroy()
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
        data.discord_spell_handler_incoming,
        data.spell_version,
        data.use_voice,
        data.voice_provider,
        data.voice_character,
        data.voice_language_code
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
        use_voice: data.use_voice,
        voice_provider: data.voice_provider,
        voice_character: data.voice_character,
        voice_language_code: data.voice_language_code,
      })
    }

    if (data.twitter_client_enable) {
      this.startTwitter(
        data.twitter_token,
        data.twitter_id,
        data.twitter_app_token,
        data.twitter_app_token_secret,
        data.twitter_access_token,
        data.twitter_access_token_secret,
        data.twitter_bot_name,
        data.twitter_bot_name_regex
      )
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
