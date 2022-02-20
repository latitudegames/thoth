import discord_client from '../../../core/src/connectors/discord'
import { instagram_client } from '../../../core/src/connectors/instagram'
import { messenger_client } from '../../../core/src/connectors/messenger'
import { reddit_client } from '../../../core/src/connectors/reddit'
import { telegram_client } from '../../../core/src/connectors/telegram'
import { twilio_client } from '../../../core/src/connectors/twilio'
import { twitter_client } from '../../../core/src/connectors/twitter'
import { whatsapp_client } from '../../../core/src/connectors/whatsapp'
//import { harmony_client } from '../../../core/src/connectors/harmony'
import { xrengine_client } from '../../../core/src/connectors/xrengine'
import { zoom_client } from '../../../core/src/connectors/zoom'
import { app, router } from '../app'
import gameObject from './gameObject'

export class agent extends gameObject {
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

  startDiscord(
    discord_api_token: string,
    spell_handler: string,
    spell_version: string
  ) {
    if (this.discord)
      throw new Error('Discord already running for this agent on this instance')
    this.discord = new discord_client()
    this.discord.createDiscordClient(
      this,
      discord_api_token,
      spell_handler,
      spell_version
    )
    console.log('Started discord client for agent ' + this.name)
  }

  stopDiscord() {
    if (!this.discord) throw new Error("Discord isn't running, can't stop it")
    this.discord.destroy()
    this.discord = null
    console.log('Stopped discord client for agent ' + this.name)
  }

  async onDestroy() {
    await super.onDestroy()
    if (this.discord) this.stopDiscord()
  }

  constructor(data: any) {
    super(data.id)
    console.log('data is ', data)
    this.name = data.agent ?? data.name ?? 'agent'
    console.log('initing agent')

    if (data.discordEnabled) {
      this.startDiscord(
        data.discord_api_key,
        data.spell_handler,
        data.spell_version
      )
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
    //     } else if (clients[i].client === 'xr-engine') {
    //       this.xrengine = new xrengine_client()
    //       this.xrengine.createXREngineClient(this, clients[i].settings)
    //     }
    //   }
    // }
  }
}

export default agent
