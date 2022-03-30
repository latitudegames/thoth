/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import Router from '@koa/router'
import Koa from 'koa'
import Twilio from 'twilio'

import { handleInput } from './handleInput'
import { getRandomEmptyResponse, getSetting } from './utils'

export class twilio_client {
  async message(
    ctx: Koa.ParameterizedContext<
      Koa.DefaultState,
      Koa.DefaultContext &
        Router.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>,
      any
    >
  ) {
    const resp = await handleInput(
      ctx.body.Body,
      ctx.body.From,
      this.settings['Agent_Name'] ?? 'Agent',
      'twilio',
      ctx.body.From,
      this.settings['entity'],
      this.settings['twilio_spell_handler'],
      this.settings['twilio_spell_version']
    )
    await this.handleTwilioMsg(ctx.body.From, resp)
  }

  async handleTwilioMsg(chat_id: string, response: string) {
    console.log('response: ' + response)
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
        text = getRandomEmptyResponse(this.settings['twilio_empty_responses'])
      this.sendMessage(chat_id, text)
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
              text = getRandomEmptyResponse(
                this.settings['twilio_empty_responses']
              )
            this.sendMessage(chat_id, text)
          }
        }
      }
    } else {
      let emptyResponse = getRandomEmptyResponse(
        this.settings['twilio_empty_responses']
      )
      while (
        emptyResponse === undefined ||
        emptyResponse === '' ||
        emptyResponse.replace(/\s/g, '').length === 0
      )
        emptyResponse = getRandomEmptyResponse(
          this.settings['twilio_empty_responses']
        )
      this.sendMessage(chat_id, emptyResponse)
    }
  }

  client: any
  settings: any

  createTwilioClient = async (app: Koa, router: Router, settings: any) => {
    this.settings = settings

    const accountSid = settings['twilioAccountSID']
    const authToken = settings['twilioAuthToken']
    const twilioNumber = settings['twilioPhoneNumber']

    if (!accountSid || !authToken || !twilioNumber)
      return console.warn('No API token for Twilio bot, skipping')
    console.log(
      'twilio client created, sid: ' + accountSid + ' auth token: ' + authToken
    )

    this.client = Twilio(accountSid, authToken)

    router.post('/sms', async (ctx, next) => {
      await this.message(ctx)
    })
  }

  sendMessage(toNumber: string, body: string) {
    console.log('sending sms: ' + body)
    this.client.messages
      .create({
        from: getSetting(this.settings, 'twilioPhoneNumber'),
        to: toNumber,
        body: body,
      })
      .then((message: any) => console.log('sent message: ' + message.sid))
      .catch(console.error)
    console.log('send message to: ' + toNumber + ' body: ' + body)
  }
}
