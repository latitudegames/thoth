import gameObject from './gameObject'
import discord_client from '../../../core/src/connectors/discord'
import { telegram_client } from '../../../core/src/connectors/telegram'
import { zoom_client } from '../../../core/src/connectors/zoom'
import { twitter_client } from '../../../core/src/connectors/twitter'
import { reddit_client } from '../../../core/src/connectors/reddit'
import { instagram_client } from '../../../core/src/connectors/instagram'
import { messenger_client } from '../../../core/src/connectors/messenger'
import { whatsapp_client } from '../../../core/src/connectors/whatsapp'
import { twilio_client } from '../../../core/src/connectors/twilio'
//import { harmony_client } from '../../../core/src/connectors/harmony'
import { xrengine_client } from '../../../core/src/connectors/xrengine'
import { app, router } from '../app'

export class agent extends gameObject {
  name = ''

  //Clients
  discord: discord_client
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

  constructor(id: number, name: string, clients: string | any[]) {
    super(id)
    this.name = name
    console.log('initing agent')

    for (let i = 0; i < clients.length; i++) {
      if (clients[i].enabled === 'true') {
        if (clients[i].client === 'discord') {
          this.discord = new discord_client()
          this.discord.createDiscordClient(this, clients[i].settings)
        } else if (clients[i].client === 'telegram') {
          this.telegram = new telegram_client()
          this.telegram.createTelegramClient(this, clients[i].settings)
        } else if (clients[i].client === 'zoom') {
          this.zoom = new zoom_client()
          this.zoom.createZoomClient(this, clients[i].settings)
        } else if (clients[i].client === 'twitter') {
          this.twitter = new twitter_client()
          this.twitter.createTwitterClient(this, clients[i].settings)
        } else if (clients[i].client === 'reddit') {
          this.reddit = new reddit_client()
          this.reddit.createRedditClient(this, clients[i].settings)
        } else if (clients[i].client === 'instagram') {
          this.instagram = new instagram_client()
          this.instagram.createInstagramClient(this, clients[i].settings)
        } else if (clients[i].client === 'messenger') {
          this.messenger = new messenger_client()
          this.messenger.createMessengerClient(app, this, clients[i].settings)
        } else if (clients[i].client === 'whatsapp') {
          this.whatsapp = new whatsapp_client()
          this.whatsapp.createWhatsappClient(this, clients[i].settings)
        } else if (clients[i].client === 'twilio') {
          this.twilio = new twilio_client()
          this.twilio.createTwilioClient(app, router, this, clients[i].settings)
        } else if (clients[i].client === 'harmony') {
          //this.harmony = new harmony_client();
          //this.harmony.createHarmonyClient(this, clients[i].settings);
        } else if (clients[i].client === 'xr-engine') {
          this.xrengine = new xrengine_client()
          this.xrengine.createXREngineClient(this, clients[i].settings)
        }
      }
    }
  }
}

export default agent
