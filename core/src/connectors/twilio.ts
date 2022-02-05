// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import Twilio from 'twilio'

import { database } from '../superreality/database'
import { getRandomEmptyResponse } from '../superreality/utils'
import { handleInput } from './handleInput'

export async function message(req, res) {
    await database.instance.getNewMessageId(
        'twilio',
        req.body.From,
        async msgId => {
            addMessageToHistory(req.body.From, req.body.From, req.body.Body, msgId)
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

            const dateNow = new Date()
            const utc = new Date(
                dateNow.getUTCFullYear(),
                dateNow.getUTCMonth(),
                dateNow.getUTCDate(),
                dateNow.getUTCHours(),
                dateNow.getUTCMinutes(),
                dateNow.getUTCSeconds()
            )
            const utcStr =
                dateNow.getDate() +
                '/' +
                (dateNow.getMonth() + 1) +
                '/' +
                dateNow.getFullYear() +
                ' ' +
                utc.getHours() +
                ':' +
                utc.getMinutes() +
                ':' +
                utc.getSeconds()

            const resp = await handleInput(
                req.body.Body,
                req.body.From,
                customConfig.instance.get('agent') ?? 'Agent',
                null,
                'twilio',
                req.body.From
            )
            await handleTwilioMsg(req.body.From, resp, client)
        }
    )
}

async function handleTwilioMsg(chat_id, response, client) {
    await database.instance.getNewMessageId('twilio', chat_id, async msgId => {
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
            sendMessage(client, chat_id, text)
            addMessageToHistory(
                chat_id,
                customConfig.instance.get('botName'),
                text,
                msgId
            )
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
                        sendMessage(client, chat_id, text)
                        addMessageToHistory(
                            chat_id,
                            customConfig.instance.get('botName'),
                            text,
                            msgId
                        )
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
            sendMessage(client, chat_id, emptyResponse)
            addMessageToHistory(
                chat_id,
                customConfig.instance.get('botName'),
                emptyResponse,
                msgId
            )
        }
    })
}

export async function getChatHistory(chatId, length) {
    return await database.instance.getHistory(length, 'twilio', chatId)
}

export async function addMessageToHistory(
    chatId,
    senderName,
    content,
    messageId
) {
    database.instance.addMessageInHistory(
        'twilio',
        chatId,
        messageId + '',
        senderName,
        content
    )
}

let client = null
export const createTwilioClient = async (app, router) => {
    const accountSid = customConfig.instance.get('twilioAccountSID')
    const authToken = customConfig.instance.get('twilioAuthToken')
    const twilioNumber = customConfig.instance.get('twilioPhoneNumber')
    if (!accountSid || !authToken || !twilioNumber)
        return console.warn('No API token for Twilio bot, skipping')

    client = new Twilio(accountSid, authToken)

    app.use(
        '/sms',
        router.post('/', async (req, res) => {
            await message(req, res)
        })
    )
}

export function sendMessage(client, toNumber, body) {
    client.messages
        .create({
            from: customConfig.instance.get('twilioPhoneNumber'),
            to: toNumber,
            body: body,
        })
        .catch(console.error)
}
