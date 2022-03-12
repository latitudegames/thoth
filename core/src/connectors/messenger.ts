/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
/* eslint-disable camelcase */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import request from 'request'

import { database } from './database'
import { handleInput } from './handleInput'
import { getRandomEmptyResponse, getSetting } from './utils'

export class messenger_client {
  async addMessageToHistory(chatId, senderName, content, messageId) {
    // database.instance.addMessageInHistory(
    //   'facebook',
    //   chatId,
    //   messageId + '',
    //   senderName,
    //   content
    // )
  }

  async handleMessage(senderPsid, receivedMessage) {
    if (await database.instance.isUserBanned(senderPsid, 'messenger')) return

    log('receivedMessage: ' + receivedMessage.text + ' from: ' + senderPsid)

    if (receivedMessage.text) {
      await database.instance.getNewMessageId(
        'messenger',
        senderPsid,
        async msgId => {
          this.addMessageToHistory(
            senderPsid,
            senderPsid,
            receivedMessage.text,
            msgId
          )
          const message = receivedMessage.text
          const resp = await handleInput(
            message,
            senderPsid,
            this.agent.name ?? 'Agent',
            'messenger',
            senderPsid
          )
          this.handlePacketSend(senderPsid, resp)
        }
      )
    }
  }

  async handlePacketSend(senderPsid, response) {
    log('response: ' + response)
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
      this.callSendAPI(senderPsid, { text: text }, text)
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
            this.callSendAPI(senderPsid, { text: text }, text)
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
      this.callSendAPI(senderPsid, { text: emptyResponse }, emptyResponse)
    }
  }

  async callSendAPI(senderPsid, response, text) {
    await database.instance.getNewMessageId(
      'messenger',
      senderPsid,
      async msgId => {
        this.addMessageToHistory(senderPsid, this.agent.name, text, msgId)
        // The page access token we have generated in your app settings
        const PAGE_ACCESS_TOKEN = getSetting(this.settings, 'messengerToken')

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
            if (!err) {
              log('Message sent!')
            } else {
              error('Unable to send message:' + err)
            }
          }
        )
      }
    )
  }

  agent
  settings

  createMessengerClient = async (app, agent, settings) => {
    this.agent = agent
    this.settings = settings

    const token = getSetting(settings, 'messengerToken')
    const verify_token = getSetting(settings, 'messengerVerifyToken')

    if (!token || !verify_token)
      return console.warn('No API tokens for Messenger bot, skipping')

    app.get('/webhook', async function (req, res) {
      const VERIFY_TOKEN = verify_token

      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']

      if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          log('WEBHOOK_VERIFIED')
          res.status(200).send(challenge)
        } else {
          log('WEBHOOK_FORBIDDEN')
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
            await this.handleMessage(senderPsid, webhookEvent.message)
          }
        })

        res.status(200).send('EVENT_RECEIVED')
      } else {
        res.sendStatus(404)
      }
    })
    log('facebook client created')
  }
}
