// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import fs from 'fs'
import path from 'path'
import pg from 'pg'
import internal from 'stream'

import { idGenerator } from './utils'

// import { initProfanityFilter } from '../components/profanityFilter'

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const { Client } = pg
const rootDir = path.resolve(path.dirname(''))

export class database {
  static instance: database

  pool: any
  client: pg.Client

  constructor() {
    database.instance = this
  }

  async connect() {
    this.client = new Client({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
      host: process.env.PGHOST,
      ssl: process.env.PGSSL
        ? {
            rejectUnauthorized: false,
          }
        : false,
    })
    this.client.connect()
    await this.client.query('SELECT NOW()')
  }

  async initData() {
    await this.readConfig()
    await this.onInit()
    // await initProfanityFilter()
  }

  async _initProfanityFilter() {
    //await initProfanityFilter()
  }

  async firstInit() {
    const id = new idGenerator()

    const query1 =
      'INSERT INTO config\n' +
      'select t.*\n' +
      'from ((SELECT ' +
      id.getId() +
      " as id, 'agent' as _key, 'Thales' as _value  \n" +
      '      ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'openai_api_key' as _key, '' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'google_project_id' as _key, '' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'hf_api_token' as _key, '' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'use_gptj' as _key, '' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'editMessageMaxCount' as _key, '5' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'botNameRegex' as _key, '((?:digital|being)(?: |$))' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'chatHistoryMessagesCount' as _key, '20' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'botName' as _key, 'digital being' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'botNameHandler' as _key, 'digital.being' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'digitalBeingsOnly' as _key, 'false' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'fastMode' as _key, 'false' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'discord_calendar_channel' as _key, '' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'discussion_channel_topics' as _key, 'Apples|Trees|Space|Universe' as _value \n" +
      '  ) union all\n' +
      '	(SELECT ' +
      id.getId() +
      " as id, 'use_logtail' as _key, 'false' as _value \n" +
      '  ) union all\n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'logtail_key' as _key, '' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'initCalendar' as _key, 'false' as _value \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'fps' as _key, '60' as _value \n" +
      '  )\n' +
      '     ) t\n' +
      'WHERE NOT EXISTS (SELECT * FROM config);'

    await this.client.query(query1)
    id.reset()

    const query2 =
      'INSERT INTO client_settings\n' +
      'select t.*\n' +
      'from ((SELECT ' +
      id.getId() +
      " as id, 'discord' as client, 'discord_api_token' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterConsumerKey' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterConsumerSecret' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterAccessToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterAccessTokenSecret' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'ngrokToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterWebhookPort' as _name, 'string' as  _type, '3002' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterID' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterBearerToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterBearerToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twitter' as client, 'twitterTweetRules' as _name, 'string' as  _type, 'digital,being,digital being' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'discord' as client, 'loadDiscordLogger' as _name, 'string' as  _type, 'false' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twilio' as client,  'twilioAccountSID' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twilio' as client, 'twiolioPhoneNumber' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'twilio' as client, 'twiolioAuthToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'telegram' as client, 'telegramBotToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'xrengine' as client, 'xrEngineURL' as _name, 'string' as  _type, 'https://dev.theoverlay.io/location/bot' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'whatsapp' as client, 'whatsappBotName' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'harmony' as client, 'harmonyURL' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'zoom' as client, 'zoomInvitationLink' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'zoom' as client, 'zoomPassword' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'messenger' as client, 'messengerToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'messenger' as client, 'messengerVerifyToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'reddit' as client, 'redditAppID' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'reddit' as client, 'redditAppSecretID' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'reddit' as client, 'redditUsername' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'reddit' as client, 'redditPassword' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'reddit' as client, 'redditOAthToken' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'instagram' as client, 'instagramUsername' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  ) union all \n' +
      ' (SELECT ' +
      id.getId() +
      " as id, 'instagram' as client, 'instagramPassword' as _name, 'string' as  _type, '' as _defaultValue \n" +
      '  )\n' +
      '     ) t\n' +
      'WHERE NOT EXISTS (SELECT * FROM client_settings);'

    await this.client.query(query2)
  }

  //reads the config table from the database
  async readConfig() {
    const configs = {}
    const query = 'SELECT * FROM config'

    const rows = await this.client.query(query)

    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        configs[rows.rows[i]._key] = rows.rows[i]._value
      }
    }

    new customConfig(configs)
  }
  //updates a config value
  async setConfig(key: any, value: any) {
    const check = 'SELECT * FROM config WHERE _key=$1'
    const cvalue = [key]

    const rows = await this.client.query(check, cvalue)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query = 'UPDATE config SET _value=$1 WHERE _key=$2'
      const values = [value, key]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO config(_key, _value) VALUES($1, $2)'
      const values = [key, value]

      await this.client.query(query, values)
    }
  }
  async deleteConfig(key: any) {
    const query = 'DELETE FROM config WHERE _key=$1'
    const values = [key]

    await this.client.query(query, values)
  }

  addMessageInHistory(
    client_name: string,
    chat_id: string,
    message_id: string,
    sender: any,
    content: any
  ) {
    const date = new Date()
    const utc = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
    const utcStr =
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      ' ' +
      utc.getHours() +
      ':' +
      utc.getMinutes() +
      ':' +
      utc.getSeconds()
    const global_message_id = client_name + '.' + chat_id + '.' + message_id
    const query =
      'INSERT INTO chat_history(client_name, chat_id, message_id, global_message_id, sender, content, createdAt) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const values = [
      client_name,
      chat_id,
      message_id,
      global_message_id,
      sender,
      content,
      utcStr,
    ]

    this.client.query(query, values, (err: { stack: any }, res: any) => {
      if (err) {
        console.error(`${err} ${err.stack}`)
      }
    })
  }

  addMessageInHistoryWithDate(
    client_name: string,
    chat_id: string,
    message_id: string,
    sender: any,
    content: any,
    date: any
  ) {
    const global_message_id = client_name + '.' + chat_id + '.' + message_id
    const query =
      'INSERT INTO chat_history(client_name, chat_id, message_id, global_message_id, sender, content, createdAt) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const values = [
      client_name,
      chat_id,
      message_id,
      global_message_id,
      sender,
      content,
      date,
    ]

    this.client.query(query, values, (err: { stack: any }, res: any) => {
      if (err) {
        console.error(`${err} ${err.stack}`)
      }
    })
  }

  async getHistory(length: number, client_name: any, chat_id: any) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2'
    const values = [client_name, chat_id]
    return await this.client.query(
      query,
      values,
      (
        err: { stack: any },
        res: { rows: string | any[] | undefined } | null | undefined
      ) => {
        if (err) {
          return console.error(`${err} ${err.stack}`)
        }
        const _res = []
        if (res !== undefined && res !== null && res.rows !== undefined) {
          for (let i = 0; i < res.rows.length; i++) {
            _res.push({
              author: res.rows[i].sender,
              content: res.rows[i].content,
            })

            if (i >= length) break
          }
        }
        return _res
      }
    )
  }

  async deleteMessage(client_name: any, chat_id: any, message_id: any) {
    const query =
      'DELETE FROM chat_history WHERE client_name=$1 AND chat_id=$2 AND message_id=$3'
    const values = [client_name, chat_id, message_id]

    await this.client.query(query, values, (err: { stack: any }, res: any) => {
      if (err) {
        console.error(`${err} ${err.stack}`)
      }
    })
  }

  async updateMessage(
    client_name: any,
    chat_id: any,
    message_id: any,
    newContent: any,
    updateTime: boolean
  ) {
    if (updateTime) {
      const date = new Date()
      const utc = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      )
      const utcStr =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        utc.getHours() +
        ':' +
        utc.getMinutes() +
        ':' +
        utc.getSeconds()
      const query =
        'UPDATE chat_history SET content=$1, createdAt=$2 WHERE client_name=$3 AND chat_id=$4 AND message_id=$5'
      const values = [newContent, utcStr, client_name, chat_id, message_id]

      await this.client.query(
        query,
        values,
        (err: { stack: any }, res: any) => {
          if (err) {
            console.error(`${err} ${err.stack}`)
          }
        }
      )
    } else {
      const query =
        'UPDATE chat_history SET content=$1 WHERE client_name=$2 AND chat_id=$3 AND message_id=$4'
      const values = [newContent, client_name, chat_id, message_id]

      await this.client.query(
        query,
        values,
        (err: { stack: any }, res: any) => {
          if (err) {
            console.error(`${err} ${err.stack}`)
          }
        }
      )
    }
  }

  async messageExists(
    client_name: string,
    chat_id: string,
    message_id: string,
    sender: any,
    content: any,
    timestamp: string | number | Date
  ) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2 AND message_id=$3'
    const values = [client_name, chat_id, message_id]

    return await this.client.query(
      query,
      values,
      (err: { stack: any }, res: { rows: string | any[] }) => {
        if (err) {
          console.error(`${err} ${err.stack}`)
        } else {
          if (res.rows && res.rows.length) {
            this.updateMessage(client_name, chat_id, message_id, content, false)
          } else {
            const date = new Date(timestamp)
            const utc = new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours(),
              date.getUTCMinutes(),
              date.getUTCSeconds()
            )
            const utcStr =
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' ' +
              utc.getHours() +
              ':' +
              utc.getMinutes() +
              ':' +
              utc.getSeconds()
            const global_message_id =
              client_name + '.' + chat_id + '.' + message_id
            const query2 =
              'INSERT INTO chat_history(client_name, chat_id, message_id, global_message_id, sender, content, createdAt) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            const values2 = [
              client_name,
              chat_id,
              message_id,
              global_message_id,
              sender,
              content,
              utcStr,
            ]

            this.client.query(
              query2,
              values2,
              (err: { stack: any }, res: any) => {
                if (err) {
                  console.error(`${err} ${err.stack}`)
                }
              }
            )
            return true
          }

          return false
        }
      }
    )
  }
  async messageExistsAsync(
    client_name: string,
    chat_id: string,
    message_id: string,
    sender: any,
    content: any,
    timestamp: string | number | Date
  ) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2 AND message_id=$3'
    const values = [client_name, chat_id, message_id]

    return await this.client.query(
      query,
      values,
      async (err: { stack: any }, res: { rows: string | any[] }) => {
        if (err) {
          console.error(`${err} ${err.stack}`)
        } else {
          if (res.rows && res.rows.length) {
            this.updateMessage(client_name, chat_id, message_id, content, false)
          } else {
            const date = new Date(timestamp)
            const utc = new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours(),
              date.getUTCMinutes(),
              date.getUTCSeconds()
            )
            const utcStr =
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' ' +
              utc.getHours() +
              ':' +
              utc.getMinutes() +
              ':' +
              utc.getSeconds()
            const global_message_id =
              client_name + '.' + chat_id + '.' + message_id
            const query2 =
              'INSERT INTO chat_history(client_name, chat_id, message_id, global_message_id, sender, content, createdAt) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            const values2 = [
              client_name,
              chat_id,
              message_id,
              global_message_id,
              sender,
              content,
              utcStr,
            ]

            await this.client.query(
              query2,
              values2,
              (err: { stack: any }, res: any) => {
                if (err) {
                  console.error(`${err} ${err.stack}`)
                }
              }
            )
            return true
          }
          return false
        }
      }
    )
  }
  async messageExistsAsyncWitHCallback(
    client_name: string,
    chat_id: string,
    message_id: string,
    sender: any,
    content: any,
    timestamp: string | number | Date,
    callback: () => void
  ) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2 AND message_id=$3'
    const values = [client_name, chat_id, message_id]

    return await this.client.query(
      query,
      values,
      async (err: { stack: any }, res: { rows: string | any[] }) => {
        if (err) {
          console.error(`${err} ${err.stack}`)
        } else {
          if (res.rows && res.rows.length) {
            this.updateMessage(client_name, chat_id, message_id, content, false)
          } else {
            const date = new Date(timestamp)
            const utc = new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours(),
              date.getUTCMinutes(),
              date.getUTCSeconds()
            )
            const utcStr =
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' ' +
              utc.getHours() +
              ':' +
              utc.getMinutes() +
              ':' +
              utc.getSeconds()
            const global_message_id =
              client_name + '.' + chat_id + '.' + message_id
            const query2 =
              'INSERT INTO chat_history(client_name, chat_id, message_id, global_message_id, sender, content, createdAt) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            const values2 = [
              client_name,
              chat_id,
              message_id,
              global_message_id,
              sender,
              content,
              utcStr,
            ]

            await this.client.query(
              query2,
              values2,
              (err: { stack: any }, res: any) => {
                if (err) {
                  console.error(`${err} ${err.stack}`)
                }
              }
            )
            callback()
          }
        }
      }
    )
  }
  async messageExistsAsyncWitHCallback2(
    client_name: any,
    chat_id: any,
    message_id: any,
    sender: any,
    content: any,
    timestamp: any,
    callback: () => void
  ) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2 AND message_id=$3'
    const values = [client_name, chat_id, message_id]

    return await this.client.query(
      query,
      values,
      async (err: { stack: any }, res: { rows: string | any[] }) => {
        if (err) {
          console.error(`${err} ${err.stack}`)
        } else {
          if (res.rows && res.rows.length) {
          } else {
            callback()
          }
        }
      }
    )
  }
  async messageExists2(
    client_name: any,
    chat_id: any,
    message_id: any,
    foundCallback: () => void,
    notFoundCallback: () => void
  ) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2 AND message_id=$3'
    const values = [client_name, chat_id, message_id]

    return await this.client.query(
      query,
      values,
      (err: { stack: any }, res: { rows: string | any[] }) => {
        if (err) {
          console.error(`${err} ${err.stack}`)
          notFoundCallback()
        } else {
          if (res && res.rows && res.rows.length > 0) foundCallback()
          else notFoundCallback()
        }
      }
    )
  }

  async getNewMessageId(
    client_name: any,
    chat_id: any,
    callback: (arg0: number) => void
  ) {
    const query =
      'SELECT * FROM chat_history WHERE client_name=$1 AND chat_id=$2'
    const values = [client_name, chat_id]

    return await this.client.query(
      query,
      values,
      (
        err: { stack: any },
        res: { rows: string | any[] | undefined } | null | undefined
      ) => {
        if (err) {
          console.error(`${err} ${err.stack}`)
        }

        if (res !== undefined && res !== null && res.rows !== undefined) {
          callback(res.rows.length + 1)
        } else {
          callback(1)
        }
      }
    )
  }

  async setConversation(
    agent: any,
    client: any,
    channel: any,
    sender: any,
    text: string | any[],
    archive: any
  ) {
    if (!text || text.length <= 0) return
    const query =
      'INSERT INTO conversation(agent, client, channel, sender, text, archive, date) VALUES($1, $2, $3, $4, $5, $6, $7)'
    const values = [
      agent,
      client,
      channel,
      sender,
      text,
      archive,
      new Date().toUTCString(),
    ]

    await this.client.query(query, values)
  }
  async getConversation(
    agent: any,
    sender: any,
    client: any,
    channel: any,
    archive: any
  ) {
    const query =
      'SELECT * FROM conversation WHERE agent=$1 AND client=$2 AND channel=$3 AND archive=$4'
    const values = [agent, client, channel, archive]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      row.rows.sort(function (
        a: { date: string | number | Date },
        b: { date: string | number | Date }
      ) {
        return new Date(b.date) - new Date(a.date)
      })
      const now = new Date()
      const max_length = parseInt(
        customConfig.instance.get('chatHistoryMessagesCount')
      )
      let data = ''
      let count = 0
      for (let i = 0; i < row.rows.length; i++) {
        if (!row.rows[i].text || row.rows[i].text.length <= 0) continue
        const messageDate = new Date(row.rows[i].date)
        const diffMs = now - messageDate
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
        if (diffMins > 15) {
          break
        }

        data += row.rows[i].sender + ': ' + row.rows[i].text + '\n'
        count++
        if (count >= max_length) {
          break
        }
      }
      return data.split('\n').reverse().join('\n')
    } else {
      return ''
    }
  }
  async clearConversations() {
    const query = 'DELETE FROM conversation'
    await this.client.query(query, values)
  }
  async setSpeakersModel(agent: any, speaker: any, model: any) {
    const test = 'SELECT * FROM speakers_model WHERE agent=$1 AND speaker=$2'
    const ctest = [agent, speaker]

    const check = await this.client.query(test, ctest)

    let query = ''
    let values = []

    if (check && check.rows && check.rows.length > 0) {
      query = 'UPDATE speakers_model SET model=$1 WHERE agent=$2 AND speaker=$3'
      values = [model, agent, speaker]
    } else {
      query =
        'INSERT INTO speakers_model(agent, speaker, model) VALUES($1, $2, $3)'
      values = [agent, speaker, model]
    }

    await this.client.query(query, values)
  }
  async getSpeakersModel(agent: any, speaker: any) {
    const query = 'SELECT * FROM speakers_model WHERE agent=$1 AND speaker=$2'
    const values = [agent, speaker]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].model
    } else {
      return ''
    }
  }
  async setSpeakersFacts(agent: any, speaker: any, facts: any) {
    const check = 'SELECT FROM speakers_facts WHERE agent=$1 AND speaker=$2'
    const cvalues = [agent, speaker]

    const test = await this.client.query(check, cvalues)

    let query = ''
    let values = []

    if (test && test.rows && test.rows.length > 0) {
      query = 'UPDATE speakers_facts SET facts=$1 WHERE agent=$2 AND speaker=$3'
      values = [facts, agent, speaker]
    } else {
      query =
        'INSERT INTO speakers_facts(agent, speaker, facts) VALUES($1, $2, $3)'
      values = [agent, speaker, facts]
    }

    await this.client.query(query, values)
  }
  async getSpeakersFacts(agent: any, speaker: any) {
    const query = 'SELECT * FROM speakers_facts WHERE agent=$1 AND speaker=$2'
    const values = [agent, speaker]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].facts
    } else {
      return ''
    }
  }
  async updateSpeakersFactsArchive(agent: any, speaker: any, facts: string) {
    const archive = await this.getSpeakersFactsArchive(agent, speaker)
    if (archive && archive.length > 0) {
      const query =
        'UPDATE speakers_facts_archive SET facts=$1 WHERE agent=$2 AND speaker=$3'
      const values = [archive + '\n' + facts, agent, speaker]

      await this.client.query(query, values)
    } else {
      const query =
        'INSERT INTO speakers_facts_archive(agent, speaker, facts) VALUES($1, $2, $3)'
      const values = [agent, speaker, facts]

      await this.client.query(query, values)
    }
  }
  async getSpeakersFactsArchive(agent: any, speaker: any) {
    const query =
      'SELECT * FROM speakers_facts_archive WHERE agent=$1 AND speaker=$2'
    const values = [agent, speaker]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].facts
    }
    return ''
  }
  async setAgentFacts(agent: any, facts: string, reset: any = false) {
    const check = 'SELECT * FROM agent_facts WHERE agent=$1'
    const cvalues = [agent]
    const res = await this.client.query(check, cvalues)
    const test = res
    let query = ''
    let values = []

    if (test && test.rows && test.rows.length > 0) {
      const newFacts = test.rows[0].facts + !reset ? '\n' + facts : ''

      query = 'UPDATE agent_facts SET facts=$1 WHERE agent=$2'
      values = [newFacts, agent]
    } else {
      query = 'INSERT INTO agent_facts(agent, facts) VALUES($1, $2)'
      values = [agent, facts]
    }

    await this.client.query(query, values)
  }
  async getAgentFacts(agent: any) {
    const query = 'SELECT * FROM agent_facts WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].facts
    } else {
      return await ''
    }
  }
  async updateAgentFactsArchive(agent: any, facts: string) {
    const archive = await this.getAgentFactsArchive(agent)
    if (archive && archive.length > 0) {
      const query = 'UPDATE agent_facts_archive SET facts=$1 WHERE agent=$2'
      const values = [archive + '\n' + facts, agent]

      await this.client.query(query, values)
    } else {
      const query =
        'INSERT INTO agent_facts_archive(agent, facts) VALUES($1, $2)'
      const values = [agent, facts]

      await this.client.query(query, values)
    }
  }
  async getAgentFactsArchive(agent: any) {
    const query = 'SELECT * FROM agent_facts_archive WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].facts
    }
    return ''
  }
  async setMeta(agent: any, speaker: any, meta: any) {
    const check = 'SELECT * FROM meta WHERE agent=$1 AND speaker=$2'
    const cvalues = [agent, speaker]

    const test = await this.client.query(check, cvalues)
    let query = ''
    let values = []

    if (test && test.rows && test.rows.length > 0) {
      query = 'UPDATE meta SET meta=$1 WHERE agent=$2 AND speaker=$3'
      values = [meta, agent, speaker]
    } else {
      query = 'INSERT INTO meta(agent, speaker, meta) VALUES($1, $2, $3)'
      values = [agent, speaker, meta]
    }

    await this.client.query(query, values)
  }
  async getMeta(agent: any, speaker: any) {
    const query = 'SELECT * FROM meta WHERE agent=$1 AND speaker=$2'
    const values = [agent, speaker]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].meta
    } else {
      return ''
    }
  }
  async setRelationshipMatrix(speaker: any, agent: any, matrix: any) {
    const check =
      'SELECT * FROM relationship_matrix WHERE speaker=$1 AND agent=$2'
    const cvalues = [speaker, agent]

    const test = await this.client.query(check, cvalues)
    let query = ''
    let values = []

    if (test && test.rows && test.rows.length > 0) {
      query =
        'UPDATE relationship_matrix SET matrix=$1 WHERE speaker=$2 AND agent=$3'
      values = [matrix, speaker, agent]
    } else {
      query =
        'INSERT INTO relationship_matrix(speaker, agent, matrix) VALUES($1, $2, $3)'
      values = [speaker, agent, matrix]
    }

    await this.client.query(query, values)
  }
  async getRelationshipMatrix(speaker: any, agent: any) {
    const query =
      'SELECT * FROM relationship_matrix WHERE speaker=$1 AND agent=$2'
    const values = [speaker, agent]

    const row = await this.client.query(query, values)
    return row && row.rows[0] ? JSON.parse(row.rows[0].matrix) : null
  }

  async setSpeakerProfaneResponses(agent: any, responses: any) {
    const query =
      'INSERT INTO speaker_profane_responses(agent, response) VALUES($1, $2)'
    const values = [agent, responses]

    await this.client.query(query, values)
  }
  async getSpeakerProfaneResponses(agent: any) {
    const query = 'SELECT * FROM speaker_profane_responses WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      let res = ''
      for (let i = 0; i < row.length; i++) {
        res += row[i].rows.response + '\n'
      }
      return res
    } else {
      return ''
    }
  }
  async setSensitiveResponses(agent: any, responses: any) {
    const query =
      'INSERT INTO sensitive_responses(agent, response) VALUES($1, $2)'
    const values = [agent, responses]

    await this.client.query(query, values)
  }
  async getSensitiveResponses(agent: any) {
    const query = 'SELECT * FROM sensitive_responses WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      let res = ''
      for (let i = 0; i < row.length; i++) {
        res += row[i].rows.response + '\n'
      }
      return res
    } else {
      return ''
    }
  }
  async setProfanceResponses(agent: any, responses: any) {
    const query =
      'INSERT INTO profane_responses(agent, response) VALUES($1, $2)'
    const values = [agent, responses]

    await this.client.query(query, values)
  }
  async getProfaneResponses(agent: any) {
    const query = 'SELECT * FROM profane_responses WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return rows.row[0].responses
    } else {
      return ''
    }
  }
  async setRating(agent: any, rating: any) {
    const check = 'SELECT * FROM rating WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)
    let query = ''
    let values = []

    if (test && test.rows && test.rows.length > 0) {
      query = 'UPDATE rating SET rating=$1 WHERE agent=$2'
      values = [rating, agent]
    } else {
      query = 'INSERT INTO rating(agent, rating) VALUES($1, $2)'
      values = [agent, rating]
    }

    await this.client.query(query, values)
  }
  async getRating(agent: any) {
    const query = 'SELECT * FROM rating WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row[0].row.rating
    } else {
      return ''
    }
  }
  async setAgentsFactsSummarization(facts: any) {
    const check = 'SELECT * FROM agent_fact_summarization WHERE agent=$1'
    const cvalues = ['common']

    const test = await this.client.query(check, cvalues)
    if (test && test.rows && test.rows.length > 0) {
      await this.client.query(
        'UPDATE agent_fact_summarization SET _sum=$1 WHERE agent=$2',
        [facts, 'common']
      )
    } else {
      await this.client.query(
        'INSERT INTO agent_fact_summarization(agent, _sum) VALUES($1, $2)',
        ['common', facts]
      )
    }
  }
  async getAgentsFactsSummarization() {
    const query = 'SELECT * FROM agent_fact_summarization WHERE agent=$1'
    const values = ['common']

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]._sum
    } else {
      return ''
    }
  }
  async getAgentsConfig(agent: string) {
    const query = 'SELECT * FROM agent_config WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      if (rows.rows[0].config.length <= 0) {
        return this.getAgentsConfig('common')
      }

      return rows.rows[0].config
    } else {
      return this.getAgentsConfig('common')
    }
  }
  async setAgentsConfig(agent: any, config: any) {
    const check = 'SELECT * FROM agent_config WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE agent_config SET config=$1 WHERE agent=$2'
      const values = [config, agent]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO agent_config(agent, config) VALUES($1, $2)'
      const values = [agent, config]

      await this.client.query(query, values)
    }
  }

  async getAgentExists(agent: any) {
    const query = 'SELECT * FROM agents WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return true
    } else {
      return false
    }
  }
  async setAgentExists(agent: any) {
    if (await this.getAgentExists(agent)) {
      return
    }

    const query = 'INSERT INTO agents(agent) VALUES($1)'
    const values = [agent]

    await this.client.query(query, values)
  }
  async getAgents() {
    const query = 'SELECT * FROM agents'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const res = []
      for (let i = 0; i < rows.rows.length; i++) {
        res.push(rows.rows[i].agent)
      }
      return res
    } else {
      return []
    }
  }

  async getActions(agent: any) {
    const query = 'SELECT * FROM actions WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].actions
    } else {
      return ''
    }
  }
  async setActions(agent: any, actions: any) {
    const check = 'SELECT * FROM actions WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE actions SET actions=$1 WHERE agent=$2'
      const values = [actions, agent]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO actions(agent, actions) VALUES($1, $2)'
      const values = [agent, actions]

      await this.client.query(query, values)
    }
  }

  async getContext(agent = 'common') {
    const query = 'SELECT * FROM context WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].context
    } else {
      return ''
    }
  }

  async setRoom(agent: any, room: any) {
    const check = 'SELECT * FROM room WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE room SET room=$1 WHERE agent=$2'
      const values = [room, agent]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO room(agent, room) VALUES($1, $2)'
      const values = [agent, room]

      await this.client.query(query, values)
    }
  }
  async getRoom(agent: any) {
    const query = 'SELECT * FROM room WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].room
    } else {
      return ''
    }
  }

  async getMorals(agent = 'common') {
    const query = 'SELECT * FROM morals WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].morals
    } else {
      return ''
    }
  }

  async setEthics(agent: any, ethics: any) {
    const check = 'SELECT * FROM ethics WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE ethics SET ethics=$1 WHERE agent=$2'
      const values = [ethics, agent]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO ethics(agent, ethics) VALUES($1, $2)'
      const values = [agent, ethics]

      await this.client.query(query, values)
    }
  }
  async getEthics(agent: any) {
    const query = 'SELECT * FROM ethics WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].ethics
    } else {
      return ''
    }
  }
  async setDefaultEthics(agent: any) {
    const query = 'INSERT INTO ethics(agent, ethics) VALUES($1, $2)'
    const values = [agent, '']

    await this.client.query(query, values)
  }
  async setDefaultNeedsAndMotivations(agent: any) {
    const query =
      'INSERT INTO needs_motivations(agent, needs_motivations) VALUES($1, $2)'
    const values = [
      agent,
      '$speaker: What would you say your needs are?\n$agent: I need to make friends with others who can house me and take care of me.',
    ]

    await this.client.query(query, values)
  }

  async setPersonality(agent: any, personality: any) {
    const query = 'INSERT INTO personality(agent, personality) VALUES($1, $2)'
    const values = [agent, personality]

    await this.client.query(query, values)
  }
  async getPersonality(agent: any) {
    const query = 'SELECT * FROM personality WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].personality
    } else {
      return ''
    }
  }

  async setNeedsAndMotivations(agent: any, needsAndMotivations: any) {
    const check = 'SELECT * FROM needs_motivations WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query =
        'UPDATE needs_motivations SET needs_motivations=$1 WHERE agent=$2'
      const values = [needsAndMotivations, agent]

      await this.client.query(query, values)
    } else {
      const query =
        'INSERT INTO needs_motivations(agent, needs_motivations) VALUES($1, $2)'
      const values = [agent, needsAndMotivations]

      await this.client.query(query, values)
    }
  }

  async getNeedsAndMotivations(agent: any) {
    const query = 'SELECT * FROM needs_motivations WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].needs_motivations
    } else {
      return ''
    }
  }

  async getDialogue(agent: any) {
    const query = 'SELECT * FROM dialogue WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].dialogue
    } else {
      return ''
    }
  }
  async setDialogue(agent: any, dialogue: any) {
    const check = 'SELECT * FROM dialogue WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE dialogue SET dialogue=$1 WHERE agent=$2'
      const values = [dialogue, agent]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO dialogue(agent, dialogue) VALUES($1, $2)'
      const values = [agent, dialogue]

      await this.client.query(query, values)
    }
  }

  async setMonologue(agent: any, monologue: any) {
    const check = 'SELECT * FROM monologue WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE monologue SET monologue=$1 WHERE agent=$2'
      const values = [monologue, agent]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO monologue(agent, monologue) VALUES($1, $2)'
      const values = [agent, monologue]

      await this.client.query(query, values)
    }
  }
  async getMonologue(agent: any) {
    const query = 'SELECT * FROM monologue WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].monologue
    } else {
      return ''
    }
  }

  async addBadWord(word: string) {
    const query = 'INSERT INTO bad_words(word) VALUES($1)'
    const values = [word]

    await this.client.query(query, values)
  }
  async badWordExists(word: any) {
    const query = 'SELECT * FROM bad_words WHERE word=$1'
    const values = [word]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async removeBadWord(word: any) {
    const query = 'DELETE FROM bad_words WHERE word=$1'
    const values = [word]

    await this.client.query(query, values)
  }
  async getBadWords() {
    const query = 'SELECT * FROM bad_words'

    const rows = await this.client.query(query)
    let res = ''
    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        res += rows.rows[i].word + '\n'
      }
    }
    return res
  }

  async addSensitiveWord(word: string) {
    const query = 'INSERT INTO sensitive_words(word) VALUES($1)'
    const values = [word]

    await this.client.query(query, values)
  }
  async sensitiveWordExists(word: any) {
    const query = 'SELECT * FROM sensitive_words WHERE word=$1'
    const values = [word]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async removeSensitiveWord(word: any) {
    const query = 'DELETE FROM sensitive_words WHERE word=$1'
    const values = [word]

    await this.client.query(query, values)
  }
  async getSensitiveWords() {
    const query = 'SELECT * FROM sensitive_words'

    const rows = await this.client.query(query)
    let res = ''
    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        res += rows.rows[i].word + '\n'
      }
    }
    return res
  }

  async addSensitivePhrase(phrase: string) {
    const query = 'INSERT INTO sensitive_phrases(phrase) VALUES($1)'
    const values = [phrase]

    await this.client.query(query, values)
  }
  async sensitivePhraseExists(phrase: any) {
    const query = 'SELECT * FROM sensitive_phrases WHERE phrase=$1'
    const values = [phrase]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async removeSensitivePhrase(phrase: any) {
    const query = 'DELETE FROM sensitive_phrases WHERE phrase=$1'
    const values = [phrase]

    await this.client.query(query, values)
  }
  async getSensitivePhrases() {
    const query = 'SELECT * FROM sensitive_phrases'

    const rows = await this.client.query(query)
    let res = ''
    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        res += rows.rows[i].phrase + '\n'
      }
    }
    return res
  }

  async addLeadingStatement(phrase: string) {
    const query = 'INSERT INTO leading_statements(statement) VALUES($1)'
    const values = [phrase]

    await this.client.query(query, values)
  }
  async leadingStatementExists(phrase: any) {
    const query = 'SELECT * FROM leading_statements WHERE statement=$1'
    const values = [phrase]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async removeLeadingStatement(phrase: any) {
    const query = 'DELETE FROM leading_statements WHERE statement=$1'
    const values = [phrase]

    await this.client.query(query, values)
  }
  async getLeadingStatements() {
    const query = 'SELECT * FROM leading_statements'

    const rows = await this.client.query(query)
    let res = ''
    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        res += rows.rows[i].statement + '\n'
      }
    }
    return res
  }

  async onInit() {
    if ((await this.getBadWords()).length <= 0) {
      const data = fs
        .readFileSync(rootDir + '/filters/bad_words.txt')
        .toString()
        .split('\n')
      for (let i = 0; i < data.length; i++) {
        await this.addBadWord(data[i])
      }
    }
    if ((await this.getSensitiveWords()).length <= 0) {
      const data = fs
        .readFileSync(rootDir + '/filters/sensitive_words.txt')
        .toString()
        .split('\n')
      for (let i = 0; i < data.length; i++) {
        await this.addSensitiveWord(data[i])
      }
    }
    if ((await this.getSensitivePhrases()).length <= 0) {
      const data = fs
        .readFileSync(rootDir + '/filters/sensitive_phrases.txt')
        .toString()
        .split('\n')
      for (let i = 0; i < data.length; i++) {
        await this.addSensitivePhrase(data[i])
      }
    }
    if ((await this.getLeadingStatements()).length <= 0) {
      const data = fs
        .readFileSync(rootDir + '/filters/leading_statements.txt')
        .toString()
        .split('\n')
      for (let i = 0; i < data.length; i++) {
        await this.addLeadingStatement(data[i])
      }
    }
  }

  async getSpeakerFactSummarization(agent = 'common') {
    const query = 'SELECT * FROM speaker_fact_summarization WHERE agent=$1'
    const values = [agent]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      return row.rows[0].summarization
    } else {
      return ''
    }
  }

  async getFacts(agent: any) {
    const query = 'SELECT * FROM facts WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].facts
    } else {
      return ''
    }
  }

  async getRandomStartingMessage(agent: string) {
    const query = 'SELECT * FROM starting_message WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      const index = getRandomNumber(0, rows.rows.length)
      if (rows.rows[index] === undefined || !rows.rows) {
        return 'Hello there!'
      }
      return rows.rows[index]._message
    } else {
      return this.getRandomStartingMessage('common')
    }
  }
  async getStartingPhrases(agent: any) {
    const query = 'SELECT * FROM starting_message WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      let res = ''
      for (let i = 0; i < rows.rows.length; i++) {
        if (rows.rows[i]._message.length <= 0) continue
        res += rows.rows[i]._message + '|'
      }
      return res
    }

    return ''
  }

  async setStartingPhrases(agent: string | any[], data: string) {
    if (!agent || agent.length <= 0) return
    const query = 'DELETE FROM starting_message WHERE agent=$1'
    const values = [agent]

    await this.client.query(query, values)

    const messages = data.split('|')
    for (let i = 0; i < messages.length; i++) {
      if (messages.length <= 0) continue
      const query2 =
        'INSERT INTO starting_message(agent, _message) VALUES($1, $2)'
      const values2 = [agent, messages[i]]

      await this.client.query(query2, values2)
    }
  }

  async getIgnoredKeywords(agent: any) {
    const query = 'SELECT * FROM ignored_keywords WHERE agent=$1 OR agent=$2'
    const values = [agent, 'common']

    const rows = await this.client.query(query, values)
    const res = []
    if (rows && rows.rows && rows.rows.length) {
      for (let i = 0; i < rows.rows.length; i++) {
        res.push(rows.rows[i].keyword)
      }
    }

    return res
  }

  async getIgnoredKeywordsData(agent: any) {
    const query = 'SELECT * FROM ignored_keywords WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length) {
      let res = ''
      for (let i = 0; i < rows.rows.length; i++) {
        if (rows.rows[i].keyword.length <= 0) continue
        res += rows.rows[i].keyword + '|'
      }
      return res
    }

    return ''
  }

  async setIgnoredKeywords(agent: string | any[], data: string) {
    if (!agent || agent.length <= 0) return
    const query = 'DELETE FROM ignored_keywords WHERE agent=$1'
    const values = [agent]

    await this.client.query(query, values)

    const keywords = data.split('|')
    for (let i = 0; i < keywords.length; i++) {
      if (keywords.length <= 0) continue
      const query2 =
        'INSERT INTO ignored_keywords(agent, keyword) VALUES($1, $2)'
      const values2 = [agent, keywords[i]]

      await this.client.query(query2, values2)
    }
  }

  async deleteAgent(agent: any) {
    let query = 'DELETE FROM agents WHERE agent=$1'
    const values = [agent]

    await this.client.query(query, values)

    query = 'DELETE FROM actions WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM dialogue WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM ethics WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM agent_facts WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM monologue WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM needs_motivations WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM personality WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM relationship_matrix WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM room WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM starting_message WHERE agent=$1'
    await this.client.query(query, values)

    query = 'DELETE FROM ignored_keywords WHERE agent=$1'
    await this.client.query(query, values)
  }

  async createAgentSQL(sql: string | any[]) {
    if (!sql || sql.length <= 0) {
      return false
    }

    await this.client.query(sql)
    return true
  }

  async addWikipediaData(agent: any, data: any) {
    const query = 'INSERT INTO wikipedia(agent, _data) VALUES($1, $2)'
    const values = [agent, data]

    await this.client.query(query, values)
  }
  async getWikipediaData(agent: any) {
    const query = 'SELECT * FROM wikipedia WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]._data
    } else {
      return ''
    }
  }
  async wikipediaDataExists(agent: any) {
    const query = 'SELECT * FROM wikipedia WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async set3dWorldUnderstandingPrompt(prompt: any) {
    const query = 'SELECT * FROM xr_world_understanding_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query2 = 'UPDATE xr_world_understanding_prompt SET _prompt=$1'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    } else {
      const query2 =
        'INSERT INTO xr_world_understanding_prompt(_prompt) VALUES($1)'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    }
  }
  async get3dWorldUnderstandingPrompt() {
    const query = 'SELECT * FROM xr_world_understanding_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]._prompt
    } else {
      return ''
    }
  }

  async setFactSummarizationPrompt(prompt: any) {
    const query = 'SELECT * FROM fact_summarization_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query2 = 'UPDATE fact_summarization_prompt SET _prompt=$1'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    } else {
      const query2 = 'INSERT INTO fact_summarization_prompt(_prompt) VALUES($1)'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    }
  }
  async getFactSummarizationPrompt() {
    const query = 'SELECT * FROM fact_summarization_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]._prompt
    } else {
      return ''
    }
  }

  async setOpinionFormPrompt(prompt: any) {
    const query = 'SELECT * FROM opinion_form_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query2 = 'UPDATE opinion_form_prompt SET _prompt=$1'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    } else {
      const query2 = 'INSERT INTO opinion_form_prompt(_prompt) VALUES($1)'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    }
  }
  async getOpinionFormPrompt() {
    const query = 'SELECT * FROM opinion_form_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]._prompt
    } else {
      return ''
    }
  }

  async setXrEngineRoomPrompt(prompt: any) {
    const query = 'SELECT * FROM xr_engine_room_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query2 = 'UPDATE xr_engine_room_prompt SET _prompt=$1'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    } else {
      const query2 = 'INSERT INTO xr_engine_room_prompt(_prompt) VALUES($1)'
      const values2 = [prompt]

      await this.client.query(query2, values2)
    }
  }
  async getXrEngineRoomPrompt() {
    const query = 'SELECT * FROM xr_engine_room_prompt'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]._prompt
    } else {
      return ''
    }
  }

  async getAgentInstances() {
    const query = 'SELECT * FROM agent_instance'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getAgentInstance(id: any) {
    const query = 'SELECT * FROM agent_instance WHERE id=$1'
    const values = [id]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]
    } else {
      return undefined
    }
  }
  async instanceIdExists(id: any) {
    const query = 'SELECT * FROM agent_instance WHERE id=$1'
    const values = [id]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
  async deleteAgentInstance(id: any) {
    const query = 'DELETE FROM agent_instance WHERE id=$1'
    const values = [id]

    await this.client.query(query, values)
  }
  async updateAgentInstances(
    id: number,
    personality: string,
    clients: string,
    enabled: string | boolean
  ) {
    console.log('clients are', clients)
    const _clients = clients ? JSON.stringify(clients).replaceAll('\\', '') : ''
    const check = 'SELECT * FROM agent_instance WHERE id=$1'
    const cvalues = [id]

    const rows = await this.client.query(check, cvalues)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query =
        'UPDATE agent_instance SET personality=$1, clients=$2, enabled=$3 WHERE id=$4'
      const values = [personality, _clients, enabled, id]

      await this.client.query(query, values)
    } else {
      const query =
        'INSERT INTO agent_instance(personality, clients, enabled) VALUES($1, $2, $3)'
      const values = [personality, clients, enabled]

      await this.client.query(query, values)
    }
  }

  async getClientSettings(client: any) {
    const query = 'SELECT * FROM client_settings WHERE client=$1'
    const values = [client]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      const res = []
      for (let i = 0; i < rows.rows.length; i++) {
        res.push({
          name: rows.rows[i]._name,
          type: rows.roes[i]._type,
          defaultValue: rows.rows[i]._defaultValue,
        }) //type is string or bool
      }
      return res
    } else {
      return []
    }
  }
  async getAllClientSettings() {
    const query = 'SELECT * FROM client_settings'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const res = []
      for (let i = 0; i < rows.rows.length; i++) {
        res.push({
          client: rows.rows[i].client,
          name: rows.rows[i]._name,
          type: rows.rows[i]._type, //string or bool
          defaultValue: rows.rows[i]._defaultvalue,
        })
      }
      return res
    } else {
      return []
    }
  }
}
