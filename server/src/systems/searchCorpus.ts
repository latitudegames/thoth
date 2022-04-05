//@ts-ignore
import cors from '@koa/cors'
//@ts-ignore
import weaviate from 'weaviate-client'
import { config } from 'dotenv-flow'
import HttpStatus from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import Router from '@koa/router'
import axios from 'axios'
import {
  includeInFields,
  removePunctuation,
  simplifyWords,
} from '../utils/utils'
import { database } from '../database'
import {
  initClassifier,
  classifyText,
} from '@latitudegames/thoth-core/src/utils/textClassifier'
import keyword_extractor from 'keyword-extractor'

config({ path: '.env' })
const searchEngine = 'davinci'
const client = weaviate.client({
  scheme: 'http',
  host: 'semantic-search-wikipedia-with-weaviate.api.vectors.network:8080/',
})

export async function initSearchCorpus(ignoreDotEnv: boolean) {
  if (ignoreDotEnv === false && process.env.ENABLE_SEARCH_CORPUS === 'false') {
    return
  }

  if (!database.instance || database.instance === undefined) {
    new database().connect()
    await initClassifier()
  }

  const app: Koa = new Koa()
  const router: Router = new Router()

  const options = {
    origin: '*',
  }
  app.use(cors(options))
  app.use(koaBody({ multipart: true }))

  router.get('/documents', async function (ctx: Koa.Context) {
    const documents = await database.instance.getAllDocuments()
    return (ctx.body = documents)
  })
  router.get('/document', async function (ctx: Koa.Context) {
    const storeId = ctx.query.storeId
    const documents: any = await database.instance.getDocumentsOfStore(storeId)
    return (ctx.body = documents)
  })
  router.post('/document', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const description = body?.description || ''
    const keywords = body?.keywords
    const is_included = body?.is_included && true
    const storeId = body?.storeId

    let id = -1
    try {
      id = await database.instance.addDocument(
        description,
        keywords,
        is_included,
        storeId
      )
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    if (id === -1) {
      return (ctx.body = 'internal error')
    }

    return (ctx.body = { documentId: id })
  })
  router.delete('/document', async function (ctx: Koa.Context) {
    const documentId = ctx.query.documentId
    console.log('deleting document: ' + documentId)

    try {
      await database.instance.removeDocument(documentId)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    return (ctx.body = 'ok')
  })
  router.post('/update_document', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const documentId = body?.documentId
    const description = body?.description || ''
    const keywords = body?.keywords
    const is_included = body?.is_included && true
    const storeId = body?.storeId

    try {
      await database.instance.updateDocument(
        documentId,
        description,
        keywords,
        is_included,
        storeId
      )
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    return (ctx.body = 'ok')
  })
  router.get('/search', async function (ctx: Koa.Context) {
    const question = ctx.request.query?.question as string
    const cleanQuestion = removePunctuation(question)
    const words = simplifyWords(cleanQuestion.split(' '))
    const topic = await classifyText(question)
    console.log('topic:', topic)

    let maxMetadata = 0
    let maxIdMetadata = -1
    let maxKeywords = 0
    let maxIdKeywords = -1

    const documents = await database.instance.getAllDocumentsForSearch()

    console.log('loaded ' + documents.length + ' documents')
    for (let i = 0; i < documents.length; i++) {
      documents[i].description = (documents[i].description as string)
        .split(',')
        .map(el => el.trim().toLowerCase())
      documents[i].keywords = (documents[i].keywords as string)
        .split(',')
        .map(el => el.trim().toLowerCase())

      const metadataCount = includeInFields(
        documents[i].description as string[],
        words
      )
      const keywordsCount = includeInFields(
        documents[i].keywords as string[],
        words
      )

      if (metadataCount > maxMetadata) {
        maxMetadata = metadataCount
        maxIdMetadata = i
      }
      if (keywordsCount > maxKeywords) {
        maxKeywords = keywordsCount
        maxIdKeywords = i
      }
    }
    console.log('maxIdMetadata ::: ', maxIdMetadata)
    console.log('maxIdKeywords ::: ', maxIdKeywords)

    const testDocs = []
    if (maxIdKeywords === maxIdMetadata && maxIdKeywords !== -1) {
      return (ctx.body = documents[maxIdKeywords])
    } else if (maxIdKeywords !== maxIdMetadata) {
      if (maxIdKeywords !== -1 && maxIdMetadata !== -1) {
        testDocs.push(documents[maxIdMetadata])
        testDocs.push(documents[maxIdKeywords])
      } else if (maxIdKeywords !== -1) {
        testDocs.push(documents[maxIdKeywords])
      } else if (maxIdMetadata !== -1) {
        testDocs.push(documents[maxIdMetadata])
      } else {
        for (let i = 0; i < documents.length; i++) {
          testDocs.push(documents[i])
        }
      }
    }

    if (testDocs.length !== 0) {
      testDocs.forEach(doc => {
        doc.keywords = doc.keywords.join(',')
        doc.description = doc.description.join(',')
      })
      let stringifiedDocuments = testDocs.map(doc => JSON.stringify(doc))
      const response = await axios.post(
        `https://api.openai.com/v1/engines/${searchEngine}/search`,
        { documents: stringifiedDocuments, query: question },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
          },
        }
      )

      let highestScore = 0
      let highestScoreIndex = -1
      console.log('response ::: ', response.data)

      for (let i = 0; i < response.data.data.length; i++) {
        if (response.data.data[i].score > highestScore) {
          highestScore = response.data.data[i].score
          highestScoreIndex = i
        }
      }

      if (highestScoreIndex >= 0) {
        return (ctx.body =
          testDocs[response.data.data[highestScoreIndex]['document']])
      } else {
        return (ctx.body = 'No documents where found to search from!')
      }
    } else return (ctx.body = 'No documents where found to search from!')
  })

  router.post('/content-object', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const description = body?.description || ''
    const keywords = body?.keywords
    const is_included = body?.is_included && true
    const documentId = body?.documentId

    let id = -1
    try {
      id = await database.instance.addContentObj(
        description,
        keywords,
        is_included,
        documentId
      )
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    if (id === -1) {
      return (ctx.body = 'internal error')
    }

    return (ctx.body = { contentObjId: id })
  })
  router.put('/content-object', async function (ctx: Koa.Context) {
    const { body } = ctx.request
    const objId = body.objId
    const description = body?.description || ''
    const keywords = body?.keywords
    const is_included = body?.is_included && true
    const documentId = body?.documentId

    try {
      await database.instance.editContentObj(
        objId,
        description,
        keywords,
        is_included,
        documentId
      )
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }

    return (ctx.body = 'ok')
  })
  router.get('/content-object', async function (ctx: Koa.Context) {
    const documentId = ctx.query.documentId
    const contentObjects: any = await database.instance.getContentObjOfDocument(
      documentId
    )

    return (ctx.body = contentObjects)
  })
  router.delete('/content-object', async function (ctx: Koa.Context) {
    const objId = ctx.query.objId
    try {
      await database.instance.removeContentObject(objId)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    return (ctx.body = 'ok')
  })

  router.get('/document-store', async function (ctx: Koa.Context) {
    const stores = await database.instance.getDocumentStores()
    return (ctx.body = stores)
  })
  router.post('/document-store', async function (ctx: Koa.Context) {
    const name = ctx.request.body?.name || ''
    let id = -1
    try {
      id = await database.instance.addDocumentStore(name)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    if (id === -1) return (ctx.body = 'internal error')
    return (ctx.body = { documentStoreId: id })
  })
  router.put('/document-store', async function (ctx: Koa.Context) {
    const storeId = ctx.request.body?.id
    const name = ctx.request.body?.name || ''
    try {
      await database.instance.updateDocumentStore(storeId, name)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    return (ctx.body = 'ok')
  })
  router.delete('/document-store', async function (ctx: Koa.Context) {
    const storeId = ctx.query.storeId
    try {
      await database.instance.removeDocumentStore(storeId)
    } catch (e) {
      console.log(e)
      return (ctx.body = 'internal error')
    }
    return (ctx.body = 'ok')
  })

  app.use(router.routes()).use(router.allowedMethods())

  app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error) {
      ctx.status =
        error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
      error.status = ctx.status
      ctx.body = { error }
      ctx.app.emit('error', error, ctx)
    }
  })

  const PORT: number = Number(process.env.SEARCH_CORPUS_PORT) || 65531

  app.listen(PORT, '0.0.0.0', () => {
    console.log('Corpus Search Server listening on: 0.0.0.0:' + PORT)
  })
}

export async function extractKeywords(input: string): Promise<string[]> {
  const keywords: string[] = []

  const res = keyword_extractor.extract(input, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  })

  if (res.length == 0) {
    return []
  }

  const result: any = await MakeModelRequest(input, 'flair/pos-english')

  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (result[j].word === res[i]) {
        if (
          result[j].entity_group === 'NN' ||
          result[j].entity_group === 'NNS'
        ) {
          keywords.push(res[i])
          break
        }
      }
    }
  }
  if (keywords.length === 0) {
    return []
  }

  let totalLength = 0
  const respp: string[] = []
  for (let i = 0; i < keywords.length; i++) {
    const weaviateResponse: any = await makeWeaviateRequest(keywords[i])

    if (weaviateResponse.Paragraph.length > 0) {
      const sum: any = await MakeModelRequest(
        weaviateResponse.Paragraph[0].content,
        'facebook/bart-large-cnn'
      )
      if (sum && sum.length > 0) {
        totalLength += sum[0].summary_text.length
        if (totalLength > 1000) {
          return keywords
        }
        respp.push(keywords[i])
      }
    }
  }
  return respp
}

export async function MakeModelRequest(
  inputs: any,
  model: string,
  parameters = {},
  options = { use_cache: false, wait_for_model: true }
) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs, parameters, options },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    )
    return await response.data
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}
export const makeWeaviateRequest = async (keyword: string) => {
  const res = await client.graphql
    .get()
    .withNearText({
      concepts: [keyword],
      certainty: 0.75,
    })
    .withClassName('Paragraph')
    .withFields('title content inArticle { ... on Article {  title } }')
    .withLimit(3)
    .do()

  if (res.data.Get !== undefined) {
    return res.data.Get
  }
  return
}
