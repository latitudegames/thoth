/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable require-await */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import path from 'path'
import pg from 'pg'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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
      user: process.env.PGUSER as any,
      password: process.env.PGPASSWORD as any,
      database: process.env.PGDATABASE as any,
      port: process.env.PGPORT as any,
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

  async firstInit() {
    const check = 'SELECT * FROM "public"."chains"'
    const r = await this.client.query(check)

    if (!r || !r.rows || r.rows.length <= 0) {
      const cquery =
        'INSERT INTO "public"."chains" ("id","name","chain","created_at","updated_at","deleted_at","user_id","modules","game_state") VALUES (\'3599a8fa-4e3b-4e91-b329-43a907780ea7\',\'default\',\'{"id": "demo@0.1.0", "nodes": {"1": {"id": 1, "data": {"name": "Input", "text": "Input text here", "outputs": [], "socketKey": "98d25387-d2b3-493c-b61c-ec20689fb101", "dataControls": {"name": {"expanded": true}, "useDefault": {"expanded": true}, "playtestToggle": {"expanded": true}}, "playtestToggle": {"outputs": [], "receivePlaytest": false}}, "name": "Universal Input", "inputs": {}, "outputs": {"output": {"connections": [{"data": {"pins": []}, "node": 5, "input": "input"}, {"data": {"pins": []}, "node": 6, "input": "outputs"}]}}, "position": [-558.857827667479, -287.8964566771861]}, "2": {"id": 2, "data": {"name": "Trigger", "socketKey": "5ce31be1-de07-4669-8ca6-61463cb2c74d", "dataControls": {"name": {"expanded": true}}}, "name": "Module Trigger In", "inputs": {}, "outputs": {"trigger": {"connections": [{"data": {"pins": []}, "node": 5, "input": "trigger"}, {"data": {"pins": []}, "node": 6, "input": "trigger"}]}}, "position": [-570.1478847920745, -18.81676187432589]}, "3": {"id": 3, "data": {"socketKey": "6e5d5852-b5a6-410c-8f8c-37ea5a32532b"}, "name": "Module Trigger Out", "inputs": {"trigger": {"connections": []}}, "outputs": {}, "position": [83.9492364030962, -61.88793070021913]}, "5": {"id": 5, "data": {"name": "Output", "socketKey": "1a13b0de-0ec2-40b9-b139-0e44674cf090", "dataControls": {"name": {"expanded": true}}}, "name": "Module Output", "inputs": {"input": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [103.51577963166771, -267.8995017050695]}, "6": {"id": 6, "data": {"inputs": [{"name": "outputs", "taskType": "output", "socketKey": "outputs", "socketType": "anySocket", "connectionType": "input"}], "dataControls": {"inputs": {"expanded": true}}}, "name": "State Write", "inputs": {"outputs": {"connections": [{"data": {"pins": []}, "node": 1, "output": "output"}]}, "trigger": {"connections": [{"data": {"pins": []}, "node": 2, "output": "trigger"}]}}, "outputs": {}, "position": [59.65794741138853, -516.9197232909086]}}}\',\'2022-02-04 10:45:31.638981+00\',\'2022-02-04 10:58:13.785909+00\',NULL,\'0\',\'[]\',\'{}\');'
      await this.client.query(cquery)
    }
  }

  async createEvent(
    type: string,
    agent: any,
    client: any,
    channel: any,
    sender: any,
    text: string | any[]
  ) {
    const query =
      'INSERT INTO events(type, agent, client, channel, sender, text, date) VALUES($1, $2, $3, $4, $5, $6, $7)'
    const values = [
      type,
      agent,
      client,
      channel,
      sender,
      text,
      new Date().toUTCString(),
    ]

    await this.client.query(query, values)
  }
  async getEvents(
    type: string,
    agent: any,
    sender: any = null,
    client: any,
    channel: any,
    asString: boolean = true,
    maxCount: number = 10
  ) {
    const query =
      'SELECT * FROM events WHERE agent=$1 AND client=$2 AND channel=$3 AND type=$4'
    const values = [agent, client, channel, type]

    console.log('getEvents')
    console.log(type, agent, sender, client, channel, asString, maxCount)
    const row = await this.client.query(query, values)
    console.log('row is', row)
    if (!row || !row.rows || row.rows.length === 0) {
      console.log('rows are null, returning')
      return asString ? '' : []
    }

    // row.rows.sort(function (
    //   a: { date: string | number | Date },
    //   b: { date: string | number | Date }
    // ) {
    //   return new Date(b.date) - new Date(a.date)
    // })

    console.log('got ' + row.rows.length + ' rows')

    const now = new Date()
    const max_length = maxCount
    let data = ''
    let count = 0
    for (let i = 0; i < row.rows.length; i++) {
      if (!row.rows[i].text || row.rows[i].text.length <= 0) continue
      // const messageDate = new Date(row.rows[i].date)
      // const diffMs = now - messageDate
      // const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
      // if (diffMins > 15) {
      //   break
      // }
      data +=
        (type === 'conversation' ? row.rows[i].sender + ': ' : '') +
        row.rows[i].text +
        (type === 'conversation' ? '\n' : type === 'facts' ? '. ' : '')
      count++
      if (count >= max_length) {
        break
      }
    }
    console.log('returning data', data)
    return asString
      ? data.split('\n').reverse().join('\n')
      : data.split('\n').reverse()
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

  async updateAgent(agent: any, data: { [x: string]: any; dialog?: any; personality?: any; facts?: any; morals?: any; monologue?: any; greetings?: any }) {
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

  async deleteAgent(id: any) {
    const query = `DELETE FROM agents WHERE id='${id}'`
    const response = await this.client.query(query)
  }

  async createAgentSQL(sql: string | any[]) {
    if (!sql || sql.length <= 0) {
      return false
    }

    await this.client.query(sql as any)
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
  async setInstanceDirtyFlag(id: any, value: boolean) {
    const query = 'UPDATE agent_instance SET dirty=$1 WHERE id=$2'
    const values = [value, id]

    await this.client.query(query, values)
  }

  async setInstanceUpdated(id: any) {
    const query = 'UPDATE agent_instance SET updated_at=$1 WHERE id=$2'
    const values = [new Date(), id]

    await this.client.query(query, values)
  }
  async updateAgentInstances(id: any, data: { [x: string]: any; dirty?: any }) {
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
    } else if (Object.keys(data).length <= 0) {
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
    description: any,
    keywords: any,
    is_included: any,
    storeId: any
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
  async removeDocument(documentId: string | string[] | undefined) {
    const query = 'DELETE FROM documents WHERE id=$1'
    const values = [documentId]

    await this.client.query(query, values)
  }
  async updateDocument(
    documentId: any,
    description: any,
    keywords: any,
    is_included: any,
    storeId: any
  ) {
    const query =
      'UPDATE documents SET description=$1, keywords=$2, is_included=$3, store_id=$4 WHERE id=$5'
    const values = [description, keywords, is_included, storeId, documentId]

    await this.client.query(query, values)
  }
  async getDocumentsOfStore(storeId: string | string[] | undefined): Promise<any> {
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
  async getDocuments(agent: any): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE agent=$1'
    const values = [agent]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async getDocumentsWithTopic(agent: any, topic: any): Promise<any[]> {
    const query = 'SELECT * FROM documents WHERE agent=$1 AND topic=$2'
    const values = [agent, topic]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) {
      return rows.rows
    } else {
      return []
    }
  }
  async documentIdExists(documentId: any) {
    const query = 'SELECT * FROM documents WHERE id=$1'
    const values = [documentId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async addContentObj(
    description: any,
    keywords: any,
    is_included: any,
    documentId: any
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
  async editContentObj(objId: any, description: any, keywords: any, is_included: any, documentId: any) {
    const query =
      'UPDATE content_objects SET description = $1, keywords = $2, is_included = $3, document_id = $4 WHERE id = $5'
    const values = [description, keywords, is_included, documentId, objId]
    await this.client.query(query, values)
  }
  async getContentObjOfDocument(documentId: string | string[] | undefined): Promise<any> {
    const query =
      'SELECT * FROM content_objects WHERE document_id = $1 ORDER BY id DESC'
    const values = [documentId]

    const rows = await this.client.query(query, values)
    if (rows && rows.rows && rows.rows.length > 0) return rows.rows
    else return []
  }
  async removeContentObject(objId: string | string[] | undefined) {
    const query = 'DELETE FROM content_objects WHERE id=$1'
    const values = [objId]

    await this.client.query(query, values)
  }
  async contentObjIdExists(contentObjId: any) {
    const query = 'SELECT * FROM content_objects WHERE id=$1'
    const values = [contentObjId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }

  async addDocumentStore(name: any): Promise<number> {
    let id = randomInt(0, 100000)
    while (await this.documentStoreIdExists(id)) {
      id = randomInt(0, 100000)
    }

    const query = 'INSERT INTO documents_store(id, name) VALUES($1,$2)'
    const values = [id, name]

    await this.client.query(query, values)
    return id
  }
  async updateDocumentStore(storeId: any, name: any) {
    const query = 'UPDATE documents_store SET name = $1 WHERE id = $2'
    const values = [name, storeId]
    await this.client.query(query, values)
  }
  async removeDocumentStore(storeId: string | string[] | undefined) {
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
  async documentStoreIdExists(documentStoreId: any) {
    const query = 'SELECT * FROM documents_store WHERE id=$1'
    const values = [documentStoreId]

    const rows = await this.client.query(query, values)
    return rows && rows.rows && rows.rows.length > 0
  }
}
