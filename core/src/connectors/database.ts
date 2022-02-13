/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable require-await */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { agentConfig } from '@latitudegames/thoth-core/src/connectors/agentConfig'
import fs from 'fs'
import path from 'path'
import pg from 'pg'
import internal from 'stream'

import { idGenerator } from './utils'

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
    await this.getConfig()
  }

  async firstInit() {
    const id = new idGenerator()

    const kv = [
      { key: 'agent', value: 'Thales' },
      { key: 'openai_api_key', value: '' },
      { key: 'google_project_id', value: '' },
      { key: 'hf_api_token', value: '' },
      { key: 'use_gptj', value: '' },
      { key: 'editMessageMaxCount', value: '5' },
      { key: 'botNameRegex', value: '((?:digital|being)(?: |$))' },
      { key: 'chatHistoryMessagesCount', value: '20' },
      { key: 'botName', value: 'digital being' },
      { key: 'botNameHandler', value: 'digital.being' },
      { key: 'digitalBeingsOnly', value: 'false' },
      { key: 'fastMode', value: 'false' },
      { key: 'discord_calendar_channel', value: '' },
      {
        key: 'discussion_channel_topics',
        value: 'Apples|Trees|Space|Universe',
      },
      { key: 'use_logtail', value: 'false' },
      { key: 'logtail_key', value: '' },
      { key: 'initCalendar', value: '' },
      { key: 'fps', value: '' },
      {
        key: 'fact_summarization',
        value: 'Instructions: Extract the facts from the following passage.',
      },
    ]

    // TODO: Simplify this, some cruft from adding our old code in
    let query = ''
    for (let i = 0; i < kv.length; i++) {
      query +=
        (i == 0 ? 'INSERT INTO config\n select t.*\n from (' : '') +
        '(SELECT ' +
        id.getId() +
        " as id, '" +
        kv[i].key +
        "' as key, '" +
        kv[i].value +
        "' as value  \n" +
        '      ) ' +
        (i !== kv.length - 1
          ? 'union all \n'
          : '\n) t\nWHERE NOT EXISTS (SELECT * FROM config);')
    }

    await this.client.query(query)
    id.reset()

    const check = 'SELECT * FROM "public"."chains"'
    const r = await this.client.query(check)

    if (!r || !r.rows || r.rows.length <= 0) {
      const cquery =
        'INSERT INTO "public"."chains" ("id","name","chain","created_at","updated_at","deleted_at","user_id","modules","game_state") VALUES (\'3599a8fa-4e3b-4e91-b329-43a907780ea7\',\'default\',\'{"id": "demo@0.1.0", "nodes": {"1": {"id": 1, "data": {"name": "Input", "text": "Input text here", "outputs": [], "socketKey": "98d25387-d2b3-493c-b61c-ec20689fb101", "dataControls": {"name": {"expanded": true}, "useDefault": {"expanded": true}, "playtestToggle": {"expanded": true}}, "playtestToggle": {"outputs": [], "receivePlaytest": false}}, "name": "Universal Input", "inputs": {}, "outputs": {"output": {"connections": [{"data": {"pins": []}, "node": 5, "input": "input"}, {"data": {"pins": []}, "node": 6, "input": "outputs"}]}}, "position": [-558.857827667479, -287.8964566771861]}, "2": {"id": 2, "data": {"name": "Trigger", "socketKey": "5ce31be1-de07-4669-8ca6-61463cb2c74d", "dataControls": {"name": {"expanded": true}}}, "name": "Module Trigger In", "inputs": {}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 5, "input": "trigger"}, {"data": {"pins": []}, "node": 6, "input": "trigger"}]}}, "position": [-570.1478847920745, -18.81676187432589]}, "3": {"id": 3, "data": {"socketKey": "6e5d5852-b5a6-410c-8f8c-37ea5a32532b"}, "name": "Module Trigger Out", "inputs": {"trigger": {"connections": []}}, "outputs": {}, "position": [83.9492364030962, -61.88793070021913]}, "5": {"id": 5, "data": {"name": "Output", "socketKey": "1a13b0de-0ec2-40b9-b139-0e44674cf090", "dataControls": {"name": {"expanded": true}}}, "name": "Module Output", "inputs": {"input": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [103.51577963166771, -267.8995017050695]}, "6": {"id": 6, "data": {"inputs": [{"name": "outputs", "taskType": "output", "socketKey": "outputs", "socketType": "anySocket", "connectionType": "input"}], "dataControls": {"inputs": {"expanded": true}}}, "name": "State Write", "inputs": {"outputs": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [59.65794741138853, -516.9197232909086]}}}\',\'2022-02-04 10:45:31.638981+00\',\'2022-02-04 10:58:13.785909+00\',NULL,\'0\',\'[]\',\'{}\');'
      await this.client.query(cquery)
    }
  }

  //reads the config table from the database
  async getConfig() {
    const configs = {}
    const query = 'SELECT * FROM config'

    const rows = (await this.client.query(query)).rows
    console.log('rows are ', rows)
    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        configs[rows.rows[i].key] = rows.rows[i].value
      }
    }

    console.log('configs are ', configs)

    return rows
  }

  //updates a config value
  async setConfig(key: any, value: any) {
    const check = 'SELECT * FROM config WHERE key=$1'
    const cvalue = [key]

    const rows = await this.client.query(check, cvalue)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query = 'UPDATE config SET value=$1 WHERE key=$2'
      const values = [value, key]

      await this.client.query(query, values)
    } else {
      const query = 'INSERT INTO config(key, value) VALUES($1, $2)'
      const values = [key, value]

      await this.client.query(query, values)
    }
  }
  async deleteConfig(key: any) {
    const query = 'DELETE FROM config WHERE key=$1'
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
  async messageExistsWithCallback(
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
    archive: any,
    asString: boolean = true
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
        (await getConfig())['chatHistoryMessagesCount']
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
      return asString
        ? data.split('\n').reverse().join('\n')
        : data.split('\n').reverse()
    } else {
      return asString ? '' : []
    }
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
    const query =
      'INSERT INTO speakers_facts(agent, speaker, facts) VALUES($1, $2, $3)'
    const values = [agent, speaker, facts]

    await this.client.query(query, values)
  }
  async getSpeakersFacts(agent: any, speaker: any, toString: boolean) {
    const query = 'SELECT * FROM speakers_facts WHERE agent=$1 AND speaker=$2'
    const values = [agent, speaker]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      const res = []
      for (let i = 0; i < row.rows.length; i++) {
        res.push(row.rows[i].facts)
      }
      return toString ? res.join(',') : res
    } else {
      return toString ? '' : []
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
    const check = 'SELECT * FROM agents WHERE agent=$1'
    const cvalues = [agent]
    const res = await this.client.query(check, cvalues)
    const test = res
    let query = ''
    let values = []

    if (test && test.rows && test.rows.length > 0) {
      const newFacts = test.rows[0].facts + !reset ? '\n' + facts : ''

      query = 'UPDATE agents SET facts=$1 WHERE agent=$2'
      values = [newFacts, agent]
    } else {
      query = 'INSERT INTO agent(agent, facts) VALUES($1, $2)'
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
  async setSpeakerAgentMeta(agent: any, speaker: any, meta: any) {
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
  async getSpeakerAgentMeta(agent: any, speaker: any) {
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
  async getAgent(agent: string) {
    const query = 'SELECT * FROM agents WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0]
    } else {
      return null
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
  async createAgent(agent: any) {
    // if (await this.getAgentExists(agent)) {
    //   return
    // }

    const query = 'INSERT INTO agents(agent) VALUES($1)'
    const values = [agent]

    await this.client.query(query, values)
  }
  async getAgents() {
    const query = 'SELECT * FROM agents'

    return (await this.client.query(query)).rows
  }

  // TODO: Move to single table with other prompts
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

  async setPersonality(agent: any, personality: any) {
    const query = 'INSERT INTO personality(agent, personality) VALUES($1, $2)'
    const values = [agent, personality]

    await this.client.query(query, values)
  }

  async setDialogue(agent: any, dialog: any) {
    const check = 'SELECT * FROM agents WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE agents SET dialog=$1 WHERE agent=$2'
      const values = [dialog, agent]

      await this.client.query(query, values)
    } else {
      throw new Error('Unable to set dialog for agent')
    }
  }

  async setMonologue(agent: any, monologue: any) {
    const check = 'SELECT * FROM agents WHERE agent=$1'
    const cvalues = [agent]

    const test = await this.client.query(check, cvalues)

    if (test && test.rows && test.rows.length > 0) {
      const query = 'UPDATE agents SET monologue=$1 WHERE agent=$2'
      const values = [monologue, agent]

      await this.client.query(query, values)
    } else {
      throw new Error('Unable to set monologue for agent')
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

  async getRandomGreeting(agent: string) {
    return 'Hello'
    // TODO: Refactor to get starting message from agent db
    // const query = 'SELECT * FROM greetings WHERE agent=$1'
    // const values = [agent]
    // const rows = await this.client.query(query, values)
    // if (rows && rows.rows && rows.rows.length > 0) {
    //   const index = getRandomNumber(0, rows.rows.length)
    //   if (rows.rows[index] === undefined || !rows.rows) {
    //     return 'Hello there!'
    //   }
    //   return rows.rows[index].message
    // } else {
    //   return this.getRandomGreeting('common')
    // }
  }

  async getGreetings(agent: any) {
    return 'Hello'
    // TODO: Refactor to get starting message from agent db
    // const query = 'SELECT * FROM greetings WHERE agent=$1'
    // const values = [agent]

    // const rows = await this.client.query(query, values)
    // if (rows && rows.rows && rows.rows.length > 0) {
    //   let res = ''
    //   for (let i = 0; i < rows.rows.length; i++) {
    //     if (rows.rows[i].message.length <= 0) continue
    //     res += rows.rows[i].message + '|'
    //   }
    //   return res
    // }

    // return ''
  }

  async setGreetings(agent: string | any[], data: string) {
    if (!agent || agent.length <= 0) return
    const messages = data.split('|')
    for (let i = 0; i < messages.length; i++) {
      if (messages.length <= 0) continue
      const query = 'UPDATE agents SET greetings=$2 WHERE agent=$1'
      const values = [agent, messages[i]]

      await this.client.query(query, values)
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
    const query = 'DELETE FROM agents WHERE agent=$1'
    const values = [agent]

    await this.client.query(query, values)
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
  async getLastUpdatedInstances() {
    const query = 'SELECT * FROM agent_instance'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      const res = []
      for (let i = 0; i < rows.rows.length; i++) {
        res.push({
          id: rows.rows[i].id,
          lastUpdated: rows.rows[i].updated_at ? rows.rows[i].updated_at : 0,
        })
      }
      return res
    } else {
      return []
    }
  }
  async setInstanceUpdated(id) {
    const query = 'UPDATE agent_instance SET updated_at=$1 WHERE id=$2'
    const values = [new Date(), id]

    await this.client.query(query, values)
  }
  async updateAgentInstances(id, personality, clients, enabled) {
    clients = JSON.stringify(clients).replaceAll('\\', '')
    const check = 'SELECT * FROM agent_instance WHERE id=$1'
    const cvalues = [id]

    const rows = await this.client.query(check, cvalues)
    if (rows && rows.rows && rows.rows.length > 0) {
      const query =
        'UPDATE agent_instance SET personality=$1, clients=$2, enabled=$3, updated_at=$4 WHERE id=$5'
      const values = [personality, clients, enabled, new Date(), id]

      await this.client.query(query, values)
    } else {
      console.log('id is', id)
      const query =
        'INSERT INTO agent_instance(personality, clients, enabled, updated_at) VALUES($1, $2, $3, $4)'
      const values = [personality, clients, enabled, new Date()]

      await this.client.query(query, values)
    }
  }
}
