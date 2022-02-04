import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import request from 'request'

import { handleInput } from '../superreality/handleInput.js'
import { database } from '../superreality/database'
import { getRandomEmptyResponse } from '../superreality/utils.js'

export async function getChatHistory(chatId, length) {
  return await database.instance.getHistory(length, 'facebook', chatId)
}

export async function addMessageToHistory(
  chatId,
  senderName,
  content,
  messageId
) {
  database.instance.addMessageInHistory(
    'facebook',
    chatId,
    messageId + '',
    senderName,
    content
  )
}

export async function handleMessage(senderPsid, receivedMessage) {
  if (receivedMessage.text) {
    await database.instance.getNewMessageId(
      'messenger',
      senderPsid,
      async msgId => {
        addMessageToHistory(senderPsid, senderPsid, receivedMessage.text, msgId)
        const message = receivedMessage.text

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

        const resp = await handleInput(
          message,
          senderPsid,
          customConfig.instance.get('agent') ?? 'Agent',
          null,
          'messenger',
          senderPsid
        )
        handlePacketSend(senderPsid, resp)
      }
    )
  }
}

export async function handlePacketSend(senderPsid, response) {
  if (
    response !== undefined &&
    response.length <= 2000 &&
    response.length > 0
  ) {
    let text = response
    while (
      text === undefined ||
      text === '' ||
      text.replace(/\s/g, '').length === 0
    )
      text = getRandomEmptyResponse()
    callSendAPI(senderPsid, { text: text }, text)
  } else if (response.length > 20000) {
    const lines = []
    let line = ''
    for (let i = 0; i < response.length; i++) {
      line += response
      if (i >= 1980 && (line[i] === ' ' || line[i] === '')) {
        lines.push(line)
        line = ''
      }
    }

    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i] !== undefined &&
        lines[i] !== '' &&
        lines[i].replace(/\s/g, '').length !== 0
      ) {
        if (i === 0) {
          let text = lines[1]
          while (
            text === undefined ||
            text === '' ||
            text.replace(/\s/g, '').length === 0
          )
            text = getRandomEmptyResponse()
          callSendAPI(senderPsid, { text: text }, text)
        }
      }
    }
  } else {
    let emptyResponse = getRandomEmptyResponse()
    while (
      emptyResponse === undefined ||
      emptyResponse === '' ||
      emptyResponse.replace(/\s/g, '').length === 0
    )
      emptyResponse = getRandomEmptyResponse()
    callSendAPI(senderPsid, { text: emptyResponse }, emptyResponse)
  }
}

export async function callSendAPI(senderPsid, response, text) {
  await database.instance.getNewMessageId(
    'messenger',
    senderPsid,
    async msgId => {
      addMessageToHistory(
        senderPsid,
        customConfig.instance.get('botName'),
        text,
        msgId
      )
      // The page access token we have generated in your app settings
      const PAGE_ACCESS_TOKEN = customConfig.instance.get('messengerToken')

      // Construct the message body
      const requestBody = {
        recipient: {
          id: senderPsid,
        },
        message: response,
      }

      // Send the HTTP request to the Messenger Platform
      request(
        {
          uri: 'https://graph.facebook.com/v2.6/me/messages',
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: 'POST',
          json: requestBody,
        },
        (err, _res, _body) => {
          if (err) {
            console.error('Unable to send message:' + err)
          }
        }
      )
    }
  )
}

export const createMessengerClient = async app => {
  const token = customConfig.instance.get('messengerToken')
  const verify_token = customConfig.instance.get('messengerVerifyToken')

  if (!token || !verify_token)
    return console.warn('No API tokens for Messenger bot, skipping')

  app.get('/webhook', async function (req, res) {
    const VERIFY_TOKEN = verify_token

    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).send(challenge)
      } else {
        res.sendStatus(403)
      }
    }
  })
  app.post('/webhook', async function (req, res) {
    const body = req.body

    if (body.object === 'page') {
      await body.entry.forEach(async function (entry) {
        const webhookEvent = entry.messaging[0]

        const senderPsid = webhookEvent.sender.id

        if (webhookEvent.message) {
          await handleMessage(senderPsid, webhookEvent.message)
        }
      })

      res.status(200).send('EVENT_RECEIVED')
    } else {
      res.sendStatus(404)
    }
  })
}
