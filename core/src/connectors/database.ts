/* eslint-disable no-console */
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
import { off } from 'process'
import internal from 'stream'

import { idGenerator, randomInt } from './utils'

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const { Client } = pg
const rootDir = path.resolve(path.dirname(''))

const useLatitude = process.env.USE_LATITUDE_API === 'true'
const PGSSL = process.env.PGSSL === 'true'
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
      ssl: PGSSL
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
      {
        key: 'openai_api_key',
        value: '',
      },
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

      {
        key: 'xr_world',
        value: 'The following is a description of the world that we are in.',
      },

      {
        key: 'opinion',
        value: 'Instructions: Form an opinion about the following statement.',
      },

      {
        key: 'xr_room',
        value: 'The following is a description of the room that we are in.',
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

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      for (let i = 0; i < rows.rows.length; i++) {
        configs[rows.rows[i].key] = rows.rows[i].value
      }
    }

    return configs
  }

  //updates a config value
  async setConfig(key: any, value: any) {
    console.log('setting ', key, value)
    const check = `SELECT * FROM config WHERE key='${key}'`

    const rows = await this.client.query(check)
    console.log('rows from setConfig are', rows)

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
  async deleteConfig(id: any) {
    const query = 'DELETE FROM config WHERE id=$1'
    const values = [id]

    await this.client.query(query, values)
  }

  async setConversation(
    agent: any,
    client: any,
    channel: any,
    sender: any,
    text: string | any[],
    archive: any
  ) {
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
    asString: boolean = true,
    maxCount: number = 10
  ) {
    const query =
      'SELECT * FROM conversation WHERE agent=$1 AND client=$2 AND channel=$3 AND archive=$4'
    const values = [agent, client, channel, archive]

    const row = await this.client.query(query, values)
    if (row && row.rows && row.rows.length > 0) {
      console.log('got ' + row.rows.length + ' rows')
      row.rows.sort(function (
        a: { date: string | number | Date },
        b: { date: string | number | Date }
      ) {
        return new Date(b.date) - new Date(a.date)
      })
      const now = new Date()
      const max_length = maxCount
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
  archiveConversation(agent: any, client: any, channel: any, sender: any) {
    const query =
      'UPDATE conversation SET archive=$1 WHERE agent=$2 AND client=$3 AND channel=$4 AND sender=$5'
    const values = [true, agent, client, channel, sender]

    this.client.query(query, values)
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

  async updateAgent(agent: any, data) {
    let q = ''
    Object.keys(data).forEach(key => {
      if (data[key] !== null) {
        data[key] = (data[key] as string)
          .replaceAll('"', ' ')
          .replaceAll("'", ' ')
        q += `${key}='${data[key]}',`
      }
    })
    // remove the last character from q
    q = q.substring(0, q.length - 1)
    const query = 'UPDATE agents SET ' + q + ' WHERE agent=$1'
    console.log('update query is', query)
    const values = [agent]

    return await this.client.query(query, values)
  }
  async createAgent(agent: any) {
    const query = 'INSERT INTO agents(agent) VALUES($1)'
    const values = [agent]

    return await this.client.query(query, values)
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
    const query = 'SELECT facts FROM agents WHERE agent=$1'
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
    const query =
      'SELECT ignored_keywords FROM agents WHERE agent=$1 OR agent=$2'
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
    const query = 'SELECT ignored_keywords FROM agents WHERE agent=$1'
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

  async deleteAgent(id: any) {
    const query = `DELETE FROM agents WHERE id='${id}'`
    const response = await this.client.query(query)
  }

  async createAgentSQL(sql: string | any[]) {
    if (!sql || sql.length <= 0) {
      return false
    }

    await this.client.query(sql)
    return true
  }

  async addWikipediaData(agent: any, data: any) {
    const query = 'INSERT INTO wikipedia(agent, data) VALUES($1, $2)'
    const values = [agent, data]

    await this.client.query(query, values)
  }
  async getWikipediaData(agent: any) {
    const query = 'SELECT * FROM wikipedia WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows[0].data
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

  async getAgentInstances() {
    const query = 'SELECT * FROM agent_instance'
    const rows = await this.client.query(query)
    return rows.rows
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
    console.log('query called', query, values)
    return await this.client.query(query, values)
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
  async setInstanceDirtyFlag(id, value) {
    const query = 'UPDATE agent_instance SET dirty=$1 WHERE id=$2'
    const values = [value, id]

    await this.client.query(query, values)
  }

  async setInstanceUpdated(id) {
    const query = 'UPDATE agent_instance SET updated_at=$1 WHERE id=$2'
    const values = [new Date(), id]

    await this.client.query(query, values)
  }
  async updateAgentInstances(id, data) {
    console.log('updateAgentInstances', id, data)
    const check = 'SELECT * FROM agent_instance WHERE id=$1'
    const cvalues = [id]

    const rows = await this.client.query(check, cvalues)
    console.log('rows', id, data)

    if (rows && rows.rows && rows.rows.length > 0) {
      data.dirty = 'true'
      let q = ''
      Object.keys(data).forEach(key => {
        if (data[key] !== null) {
          q += `${key}='${data[key]}',`
        }
      })

      const query =
        'UPDATE agent_instance SET ' + q + ' updated_at=$1 WHERE id=$2'
      const values = [new Date().toUTCString(), id]
      console.log('called ', query)
      try {
        return await this.client.query(query, values)
      } catch (e) {
        throw new Error(e)
      }
    } else if (Object.keys(data) <= 0) {
      const query = 'INSERT INTO agent_instance (personality) VALUES ($1)'
      const values = ['common']
      console.log('called ', query)
      try {
        return await this.client.query(query, values)
      } catch (e) {
        throw new Error(e)
      }
    } else {
      console.log('nope ', data)
    }
  }

  async addDocument(
    description,
    keywords,
    is_included,
    storeId
  ): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.documentIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query =
      'INSERT INTO documents(id, description, keywords, is_included, store_id) VALUES($1, $2, $3, $4, $5)'
    const values = [id, description, keywords, is_included, storeId]

    await this.client.query(query, values)
    return id
  }
  async removeDocument(documentId) {
    const query = 'DELETE FROM documents WHERE id=$1'
    const values = [documentId]

    await this.client.query(query, values)
  }
  async updateDocument(
    documentId,
    description,
    keywords,
    is_included,
    storeId
  ) {
    const query =
      'UPDATE documents SET description=$1, keywords=$2, is_included=$3, store_id=$4 WHERE id=$5'
    const values = [description, keywords, is_included, storeId, documentId]

    await this.client.query(query, values)
  }
  async getDocumentsOfStore(storeId): Promise<any> {
    const query = 'SELECT * FROM documents WHERE store_id=$1 ORDER BY id DESC'
    const values = [storeId]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getAllDocuments(): Promise<any[]> {
    const query = 'SELECT * FROM documents'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getAllDocumentsForSearch(): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE is_included = true'

    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getDocuments(agent): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getDocumentsWithTopic(agent, topic): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE agent=$1 AND topic=$2'
    const values = [agent, topic]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async documentIdExists(documentId) {
    const query = 'SELECT * FROM documents WHERE id=$1'
    const values = [documentId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async addContentObj(
    description,
    keywords,
    is_included,
    documentId
  ): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.contentObjIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query =
      'INSERT INTO content_objects(id, description, keywords, is_included, document_id) VALUES($1, $2, $3, $4, $5)'
    const values = [id, description, keywords, is_included, documentId]

    await this.client.query(query, values)
    return id
  }
  async editContentObj(objId, description, keywords, is_included, documentId) {
    const query =
      'UPDATE content_objects SET description = $1, keywords = $2, is_included = $3, document_id = $4 WHERE id = $5'
    const values = [description, keywords, is_included, documentId, objId]
    await this.client.query(query, values)
  }
  async getContentObjOfDocument(documentId): Promise<any> {
    const query =
      'SELECT * FROM content_objects WHERE document_id = $1 ORDER BY id DESC'
    const values = [documentId]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async removeContentObject(objId) {
    const query = 'DELETE FROM content_objects WHERE id=$1'
    const values = [objId]

    await this.client.query(query, values)
  }
  async contentObjIdExists(contentObjId) {
    const query = 'SELECT * FROM content_objects WHERE id=$1'
    const values = [contentObjId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async addDocumentStore(name): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.documentStoreIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query = 'INSERT INTO documents_store(id, name) VALUES($1,$2)'
    const values = [id, name]

    await this.client.query(query, values)
    return id
  }
  async updateDocumentStore(storeId, name) {
    const query = 'UPDATE documents_store SET name = $1 WHERE id = $2'
    const values = [name, storeId]
    await this.client.query(query, values)
  }
  async removeDocumentStore(storeId) {
    const query = 'DELETE FROM documents_store WHERE id = $1'
    const values = [storeId]
    await this.client.query(query, values)
  }
  async getDocumentStores(): Promise<any[]> {
    const query = 'SELECT * FROM documents_store'
    const rows = await this.client.query(query)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async documentStoreIdExists(documentStoreId) {
    const query = 'SELECT * FROM documents_store WHERE id=$1'
    const values = [documentStoreId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
}
