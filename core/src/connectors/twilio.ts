/* eslint-disable no-invalid-this */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import Twilio from 'twilio'

import { database } from '../superreality/database'
import { getRandomEmptyResponse, getSetting } from '../superreality/utils'
import { handleInput } from './handleInput'

export class twilio_client {
  async message(req, res) {
    if (await database.instance.isUserBanned(req.body.From, 'twilio')) return
    log('received message: ' + req.body.Body)
    await database.instance.getNewMessageId(
      'twilio',
      req.body.From,
      async msgId => {
        this.addMessageToHistory(
          req.body.From,
          req.body.From,
          req.body.Body,
          msgId
        )
        const message = '!ping ' + req.body.Body

        const args = {}
        args['grpc_args'] = {}

        args['parsed_words'] = message.slice('!'.length).trim().split(/ +/g)

        // Grab the command data from the client.commands Enmap
        args['command_info'] = [
          'ping',
          ['HandleMessage'],
          ['sender', 'message', 'client_name', 'chat_id', 'createdAt'],
          'ping all agents',
        ]
        args['grpc_args']['sender'] = req.body.From
        if (args['command_info']) {
          args['command'] = args['command_info'][0]
          args['grpc_args']['message'] = message.replace(
            '!' + args['command'],
            ''
          ) //remove .command from message
          args['grpc_method'] = args['command_info'][1][0]
          args['grpc_method_params'] = args['command_info'][2]
        }

        args['grpc_args']['client_name'] = 'twilio'
        args['grpc_args']['chat_id'] = req.body.From + ''

        const resp = await handleInput(
          req.body.Body,
          req.body.From,
          this.agent.name ?? 'Agent',
          null,
          'twilio',
          req.body.From
        )
        await this.handleTwilioMsg(req.body.From, resp, client)
      }
    )
  }

  async handleTwilioMsg(chat_id, response, client) {
    await database.instance.getNewMessageId('twilio', chat_id, async msgId => {
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
        this.sendMessage(client, chat_id, text)
        this.addMessageToHistory(chat_id, this.agent.name, text, msgId)
      } else if (response.length > 160) {
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
              this.sendMessage(client, chat_id, text)
              this.addMessageToHistory(chat_id, this.agent.name, text, msgId)
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
        this.sendMessage(client, chat_id, emptyResponse)
        this.addMessageToHistory(chat_id, this.agent.name, emptyResponse, msgId)
      }
    })
  }

  async getChatHistory(chatId, length) {
    return await database.instance.getHistory(length, 'twilio', chatId)
  }

  async addMessageToHistory(chatId, senderName, content, messageId) {
    database.instance.addMessageInHistory(
      'twilio',
      chatId,
      messageId + '',
      senderName,
      content
    )
  }

  client = null
  agent
  settings

  createTwilioClient = async (app, router, agent, settings) => {
    this.agent = agent
    this.settings = settings

    const accountSid = getSetting(settings, 'twilioAccountSID')
    const authToken = getSetting(settings, 'twilioAuthToken')
    const twilioNumber = getSetting(settings, 'twilioPhoneNumber')
    log('init')
    if (!accountSid || !authToken || !twilioNumber)
      return console.warn('No API token for Twilio bot, skipping')
    log(
      'twilio client created, sid: ' + accountSid + ' auth token: ' + authToken
    )

    client = new Twilio(accountSid, authToken)

    app.use(
      '/sms',
      router.post('/', async (req, res) => {
        await message(req, res)
      })
    )
  }

  sendMessage(client, toNumber, body) {
    log('sending sms: ' + body)
    client.messages
      .create({
        from: getSetting(this.settings, 'twilioPhoneNumber'),
        to: toNumber,
        body: body,
      })
      .then(message => log('sent message: ' + message.sid))
      .catch(console.error)
    log('send message to: ' + toNumber + ' body: ' + body)
  }
}
