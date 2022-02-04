// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { handleInput } from "../superreality/handleInput"
import { database } from "../superreality/database"
import { customConfig } from '../superreality/customConfig'
import roomManager from "../superreality/roomManager"
import { classifyText } from "../superreality/textClassifier"
import { getRandomEmptyResponse, startsWithCapital } from "./utils"

async function handleMessage(chat_id, response, message_id, addPing, args, bot) {
    let senderId = ''
    let senderName = ''
    if (args !== 'none' && args.startsWith('[') && args[args.length - 1] === ']') {
        args = JSON.parse(args)
        senderId = args[0]
        senderName = args[1]
    }
    if (response !== undefined && response.length > 0) {
        let text = response
        while (text === undefined || text === '' || text.replace(/\s/g, '').length === 0) text = getRandomEmptyResponse()
        if (addPing) bot.sendMessage(chat_id, `<a href="tg://user?id=${senderId}">${senderName}</a> ${text}`, { parse_mode: 'HTML' }).then(function (_resp) {
            onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
            addMessageToHistory(_resp.chat.id, _resp.message_id, customConfig.instance.get('botName'), text)
        }).catch(console.error)
        else bot.sendMessage(chat_id, text).then(function (_resp) {
            onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
            addMessageToHistory(_resp.chat.id, _resp.message_id, customConfig.instance.get('botName'), text)
        }).catch(console.error)
    }
    else {
        let emptyResponse = getRandomEmptyResponse()
        while (emptyResponse === undefined || emptyResponse === '' || emptyResponse.replace(/\s/g, '').length === 0) emptyResponse = getRandomEmptyResponse()
        if (addPing) bot.sendMessage(chat_id, `<a href="tg://user?id=${senderId}">${senderName}</a> ${emptyResponse}`, { parse_mode: 'HTML' }).then(function (_resp) {
            onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
            addMessageToHistory(_resp.chat.id, _resp.message_id, customConfig.instance.get('botName'), emptyResponse)
        }).catch(console.error)
        else bot.sendMessage(chat_id, emptyResponse).then(function (_resp) {
            onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
            addMessageToHistory(_resp.chat.id, _resp.message_id, customConfig.instance.get('botName'), emptyResponse)
        }).catch(console.error)
    }
}

async function handleEditMessage(chat_id, message_id, response, args, bot) {
    let senderId = ''
    let senderName = ''
    if (args !== 'none' && args.startsWith('[') && args[args.length - 1] === ']') {
        args = JSON.parse(args)
        senderId = args[0]
        senderName = args[1]
    }
    if (response !== undefined && response.length <= 2000 && response.length > 0) {
        let text = response
        while (text === undefined || text === '' || text.replace(/\s/g, '').length === 0) text = getRandomEmptyResponse()
        bot.sendMessage(chat_id, `<a href="tg://user?id=${senderId}">${senderName}</a> ${text}`, { parse_mode: 'HTML' }).then(function (_resp) {
            onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
            addMessageToHistory(_resp.chat.id, _resp.message_id, telegramPacketHandler.instance.botName, text)
        }).catch(console.error)
    }
    else if (response.length > 2000) {
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
            if (lines[i] !== undefined && lines[i] !== '' && lines[i].replace(/\s/g, '').length !== 0) {
                if (i === 0) {
                    let text = lines[1]
                    while (text === undefined || text === '' || text.replace(/\s/g, '').length === 0) text = getRandomEmptyResponse()
                    bot.sendMessage(chat_id, `<a href="tg://user?id=${senderId}">${senderName}</a> ${text}`, { parse_mode: 'HTML' }).then(function (_resp) {
                        onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
                        addMessageToHistory(_resp.chat.id, _resp.message_id, telegramPacketHandler.instance.botName, text)
                    }).catch(console.error)
                }
            }
        }
    }
    else {
        let emptyResponse = getRandomEmptyResponse()
        while (emptyResponse === undefined || emptyResponse === '' || emptyResponse.replace(/\s/g, '').length === 0) emptyResponse = getRandomEmptyResponse()
        bot.sendMessage(chat_id, `<a href="tg://user?id=${senderId}">${senderName}</a> ${emptyResponse}`, { parse_mode: 'HTML' }).then(function (_resp) {
            onMessageResponseUpdated(_resp.chat.id, message_id, _resp.message_id)
            addMessageToHistory(_resp.chat.id, _resp.message_id, telegramPacketHandler.instance.botName, emptyResponse)
        }).catch(console.error)
    }
}

export async function onMessageEdit(bot, msg, botName) {
    const date = Date.now() / 1000
    const msgDate = msg.date
    const diff = date - msgDate
    const hoursDiff = Math.ceil(diff / 3600)
    const mins_diff = Math.ceil((diff - hoursDiff) / 60)
    if (mins_diff > 12 || (mins_diff <= 12 && hoursDiff > 1)) return
    const _sender = msg.from.username === undefined ? msg.from.first_name : msg.from.username

    updateMessage(msg.chat.id, msg.message_id, msg.text)
    if (msg.from.is_bot) return

    const oldResponse = getResponse(msg.chat.id, msg.message_id)
    if (oldResponse === undefined) return

    const dateNow = new Date();
    var utc = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(), dateNow.getUTCHours(), dateNow.getUTCMinutes(), dateNow.getUTCSeconds());
    const utcStr = dateNow.getDate() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

    const resp = handleInput(msg.text, msg.from.first_name, customConfig.instance.get('agent') ?? "Agent", null, 'telegram', msg.chat.id);
    await handleEditMessage(msg.chat.id, msg.message_id, resp, '[ \'' + msg.from.id + '\', \'' + msg.from.first_name + '\' ]', bot);
}

export async function onMessage(bot, msg, botName, username_regex) {
    addMessageToHistory(msg.chat.id, msg.message_id, msg.from.username === undefined ? msg.from.first_name : msg.from.username, msg.text)
    const date = Date.now() / 1000
    const msgDate = msg.date
    const diff = date - msgDate
    const hoursDiff = Math.ceil(diff / 3600)
    const mins_diff = Math.ceil((diff - hoursDiff) / 60)
    if (mins_diff > 12 || (mins_diff <= 12 && hoursDiff > 1)) return

    let content = msg.text
    const _sender = msg.from.username === undefined ? msg.from.first_name : msg.from.username
    addMessageToHistory(msg.chat.id, msg.message_id, _sender, content)
    let addPing = false
    if (msg.chat.type == 'supergroup') {
        if (content === '') content = '{sent media}'
        let isReply = false
        if (msg.reply_to_message !== undefined) {
            if (msg.reply_to_message.from.username === botName) isReply = true
            else {
                exitConversation(_sender)
                const _replyTo = msg.reply_to_message.from.username === undefined ? msg.reply_to_message.from.first_name : msg.reply_to_message.from.username
                exitConversation(_replyTo)
                return
            }
        }
        let _prev = undefined
        if (!msg.from.is_bot) {
            _prev = prevMessage[msg.chat.id]
            prevMessage[msg.chat.id] = _sender
            if (prevMessageTimers[msg.chat.id] !== undefined) clearTimeout(prevMessageTimers[msg.chat.id])
            prevMessageTimers[msg.chat.id] = setTimeout(() => prevMessage[msg.chat.id] = '', 120000)
        }
        addPing = (_prev !== undefined && _prev !== '' && _prev !== _sender) || moreThanOneInConversation()

        const isMention = msg.entities !== undefined && msg.entities.length === 1 && msg.entities[0].type === 'mention' && content.includes('@' + customConfig.instance.get('telegramBotName'))
        const otherMention = msg.entities !== undefined && msg.entities.length > 0 && msg.entities[0].type === 'mention' && !content.includes('@' + customConfig.instance.get('telegramBotName'))
        let startConv = false
        let startConvName = ''
        if (!isMention && !otherMention) {
            const trimmed = content.trimStart()
            if (trimmed.toLowerCase().startsWith('hi')) {
                const parts = trimmed.split(' ')
                if (parts.length > 1) {
                    if (!startsWithCapital(parts[1])) {
                        startConv = true
                    }
                    else {
                        startConv = false
                        startConvName = parts[1]
                    }
                }
                else {
                    if (trimmed.toLowerCase() === 'hi') {
                        startConv = true
                    }
                }
            }
        }
        if (otherMention) {
            exitConversation(_sender)
            for (let i = 0; i < msg.entities.length; i++) {
                if (msg.entities[i].type === 'mention') {
                    const _user = msg.text.slice(msg.entities[i].offset + 1, msg.entities[i].length)
                    exitConversation(_user)
                }
            }
        }
        if (!startConv) {
            if (startConvName.length > 0) {
                exitConversation(_sender)
                exitConversation(startConvName)
            }
        }

        const isUserNameMention = content.toLowerCase().replace(',', '').replace('.', '').replace('?', '').replace('!', '').match(username_regex)
        const isInDiscussion = isInConversation(_sender)
        if (!content.startsWith('!') && !otherMention) {
            if (isMention) content = '!ping ' + content.replace('!', '').trim()
            else if (isUserNameMention) content = '!ping ' + content.replace(username_regex, '').trim()
            else if (isInDiscussion || startConv || isReply) content = '!ping ' + content
        }

        if (!otherMention && content.startsWith('!ping')) sentMessage(_sender)

        if (otherMention) {
            roomManager.instance.userPingedSomeoneElse(_sender, 'telegram');
        }
    }
    else {
        content = '!ping ' + content
    }

    if (content === '!ping ' || !content.startsWith('!ping')) {
        if (roomManager.instance.agentCanResponse(user, 'telegram')) {
            content = '!ping ' + content;
            sentMessage(_sender)
        }
        else {
            const oldChat = database.instance.getConversation("testAgent", _sender, 'telegram', msg.chat.id, false);
            if (oldChat !== undefined && oldChat.length > 0) {
                const context = await classifyText(values);
                const ncontext = await classifyText(content);

                if (context == ncontext) {
                    roomManager.instance.userTalkedSameTopic(_sender, 'telegram');
                    if (roomManager.instance.agentCanResponse(_sender, 'telegram')) {
                        content = '!ping ' + content;
                        sentMessage(_sender)
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            }
        }
    } else {
        roomManager.instance.userGotInConversationFromAgent(_sender);
    }

    const resp = handleInput(msg.text, msg.from.first_name, customConfig.instance.get('agent') ?? "Agent", null, 'telegram', msg.chat.id);
    await handleEditMessage(msg.chat.id, msg.message_id, resp, addPing ? '[ \'' + msg.from.id + '\', \'' + msg.from.first_name + '\' ]' : 'none', bot);
}

export const prevMessage = {}
export const prevMessageTimers = {}
export const messageResponses = {}
export const conversation = {}
export const chatHistory = {}

export function onMessageDeleted(chatId, messageId) {
    if (messageResponses[chatId] !== undefined && messageResponses[chatId][messageId] !== undefined) {
        delete messageResponses[chatId][messageId]
    }
}
export function onMessageResponseUpdated(chatId, messageId, newResponse) {
    if (messageResponses[chatId] === undefined) messageResponses[chatId] = {}
    messageResponses[chatId][messageId] = newResponse
}

export function getMessage(chatId, messageId) {
    return chatId.messages.fetchMessage(messageId)
}

export function isInConversation(user) {
    return conversation[user] !== undefined && conversation[user].isInConversation === true
}

export function sentMessage(user) {
    for (let c in conversation) {
        if (c === user) continue
        if (conversation[c] !== undefined && conversation[c].timeOutFinished === true) {
            exitConversation(c)
        }
    }

    if (conversation[user] === undefined) {
        conversation[user] = { timeoutId: undefined, timeOutFinished: true, isInConversation: true }
        if (conversation[user].timeoutId !== undefined) clearTimeout(conversation[user].timeoutId)
        conversation[user].timeoutId = setTimeout(() => {
            if (conversation[user] !== undefined) {
                conversation[user].timeoutId = undefined
                conversation[user].timeOutFinished = true
            }
        }, 720000)
    } else {
        conversation[user].timeoutId = setTimeout(() => {
            if (conversation[user] !== undefined) {
                conversation[user].timeoutId = undefined
                conversation[user].timeOutFinished = true
            }
        }, 720000)
    }
}

export function exitConversation(user) {
    if (conversation[user] !== undefined) {
        if (conversation[user].timeoutId !== undefined) clearTimeout(conversation[user].timeoutId)
        conversation[user].timeoutId = undefined
        conversation[user].timeOutFinished = true
        conversation[user].isInConversation = false
        delete conversation[user]
        roomManager.instance.removeUser(user, 'discord');
    }
}

export function moreThanOneInConversation() {
    let count = 0
    for (let c in conversation) {
        if (conversation[c] === undefined) continue
        if (conversation[c].isInConversation !== undefined && conversation[c].isInConversation === true && conversation[c].timeOutFinished === false) count++
    }

    return count > 1
}

export function getResponse(chatId, message) {
    if (messageResponses[chatId] === undefined) return undefined
    return messageResponses[chatId][message]
}

export async function addMessageToHistory(chatId, messageId, senderName, content) {
    await database.instance.addMessageInHistory('telegram', chatId, messageId, senderName, content)
}
export async function getChatHistory(chatId, length) {
    return await database.instance.getHistory(length, 'telegram', chatId)
}
export async function updateMessage(chatId, messageId, newContent) {
    await database.instance.updateMessage('telegram', chatId, messageId, newContent, true)
}

export const createTelegramClient = () => {
    const token = customConfig.instance.get('telegramBotToken')

    if (!token) return console.warn("No API token for Telegram bot, skipping");
    const username_regex = new RegExp(customConfig.instance.get('botNameRegex'), 'ig')
    let botName = ''

    const bot = new TelegramBot(token, { polling: true })
    bot.getMe().then(info => botName = info.username).catch(console.error)

    bot.on('message', async (msg) => {
        await onMessage(bot, msg, botName, username_regex)
    })
    bot.on('edited_message', async (msg) => {
        await onMessageEdit(bot, msg, botName)
    });
    new telegramPacketHandler(bot, botName)
}

export default createTelegramClient;