import SnooStream from 'snoostream';
import * as snoowrap from 'snoowrap';
import { handleInput } from '../superreality/handleInput.js';
import { database } from '../superreality/database';
import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'


export let reddit;

export const prevMessage = {}
export const prevMessageTimers = {}
export const messageResponses = {}
export const conversation = {}

export function onMessageDeleted(channel, messageId) {
    if (messageResponses[channel] !== undefined && messageResponses[channel][messageId] !== undefined) {
        delete messageResponses[channel][messageId]
    }
}
export function onMessageResponseUpdated(channel, messageId, newResponse) {
    if (messageResponses[channel] === undefined) messageResponses[channel] = {}
    messageResponses[channel][messageId] = newResponse
}

export function getMessage(channel, messageId) {
    return channel.messages.fetchMessage(messageId)
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
        }, 480000)
    } else {
        conversation[user].timeoutId = setTimeout(() => {
            if (conversation[user] !== undefined) {
                conversation[user].timeoutId = undefined
                conversation[user].timeOutFinished = true
            }
        }, 480000)
    }
}

export function exitConversation(user) {
    if (conversation[user] !== undefined) {
        if (conversation[user].timeoutId !== undefined) clearTimeout(conversation[user].timeoutId)
        conversation[user].timeoutId = undefined
        conversation[user].timeOutFinished = true
        conversation[user].isInConversation = false
        delete conversation[user]
    }
}

export function getResponse(channel, message) {
    if (messageResponses[channel] === undefined) return undefined
    return messageResponses[channel][message]
}

async function handleMessage(response, messageId, chat_id, args, reddit) {
    if (args === 'isChat') {
        redditHandler.instance.reddit.getMessage(messageId).reply(responses[key]).then(res => {
            database.instance.addMessageInHistory('reddit', chat_id, res.id, customConfig.instance.get('botName'), response)
        })
    } else if (args === 'isPost') {
        reddit.getSubmission(chat_id).reply(responses[key]).then(res => {
            database.instance.addMessageInHistory('reddit', chat_id, res.id, customConfig.instance.get('botName'), response)
        })
    }
}

export function addMessageToHistory(chatId, messageId, senderName, content) {
    database.instance.addMessageInHistory('reddit-chat', chatId, messageId, senderName, content)
}
export async function addMessageInHistoryWithDate(chatId, messageId, senderName, content, timestamp) {
    await database.instance.addMessageInHistoryWithDate('reddit-chat', chatId, messageId, senderName, content, timestamp)
}
export async function deleteMessageFromHistory(chatId, messageId) {
    await database.instance.deleteMessage('reddit-chat', chatId, messageId)
}
export async function updateMessage(chatId, messageId, newContent) {
    await database.instance.updateMessage('reddit-chat', chatId, messageId, newContent, true)
}
export async function wasHandled(chatId, messageId, sender, content, timestamp) {
    return await database.instance.messageExistsAsync('reddit-chat', chatId, messageId, sender, content, timestamp)
}

export const createRedditClient = async () => {
    const appId = customConfig.instance.get('redditAppID')
    const appSecredId = customConfig.instance.get('redditAppSecretID')
    const oauthToken = customConfig.instance.get('redditOathToken')
    //https://github.com/not-an-aardvark/reddit-oauth-helper
    if (!appId || !appSecredId) return console.warn("No API token for Reddit bot, skipping");

    const snooWrapOpptions = {
        continueAfterRatelimitError: true,
        requestDelay: 1100
    }

    reddit = new snoowrap({
        userAgent: 'test_db_app',
        clientId: appId,
        clientSecret: appSecredId,
        refreshToken: oauthToken
    });
    reddit.config(snooWrapOpptions);
    const stream = new SnooStream(reddit)

    const regex = new RegExp('((?:carl|sagan)(?: |$))', 'ig')

    let commentStream = stream.commentStream('test_db')
    commentStream.on('post', async (post, match) => {
        let _match;
        if (post.hasOwnProperty('body')) {
            _match = post.body.match(regex);
        } else if (post.hasOwnProperty('selftext')) {
            _match = post.selftext.match(regex);
        }

        if (_match) {
            const id = post.id
            const chat_id = post.link_url.split('/')[6]
            const senderId = post.author_fullname
            const author = post.author.name
            const body = post.body
            const timestamp = post.created_utc
            const resp = await handleInput(body, author, customConfig.instance.get('agent') ?? "Agent", null, 'reddit', chat_id);
            await handleMessage(resp, id, chat_id, 'isPost', reddit);
            const date = new Date(post.created)
            const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

            database.instance.addMessageInHistoryWithDate('reddit', chat_id, id, author, body, utcStr)
        } else {
            await database.instance.messageExistsAsyncWitHCallback2('reddit', post.link_url.split('/')[6], post.id, post.author.name, post.body, post.timestamp, () => {
                const id = post.id
                const chat_id = post.link_url.split('/')[6]
                const senderId = post.author_fullname
                const author = post.author
                const body = post.body
                const timestamp = post.created_utc
                const resp = await handleInput(body, author, customConfig.instance.get('agent') ?? "Agent", null, 'reddit', chat_id);
                await handleMessage(resp, id, chat_id, 'isPost', reddit);
                const date = new Date(post.created)
                const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

                database.instance.addMessageInHistoryWithDate('reddit', chat_id, id, author, body, utcStr)
            })
        }
    });
    let submissionStream = stream.submissionStream('test_db', { regex: '((?:carl|sagan)(?: |$))' })
    submissionStream.on('post', async (post, match) => {
        let _match;
        if (post.hasOwnProperty('body')) {
            _match = post.body.match(regex);
        } else if (post.hasOwnProperty('selftext')) {
            _match = post.selftext.match(regex);
        }

        if (_match) {
            const id = post.id
            const chat_id = post.id
            const senderId = post.author_fullname
            const author = post.author.name
            const body = post.selftext
            const timestamp = post.created_utc
            const resp = await handleInput(body, author, customConfig.instance.get('agent') ?? "Agent", null, 'reddit', chat_id);
            await handleMessage(resp, id, chat_id, 'isPost', reddit);
            const date = new Date(post.created)
            const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

            database.instance.addMessageInHistoryWithDate('reddit', chat_id, id, author, body, utcStr)
        } else {
            await database.instance.messageExistsAsyncWitHCallback2('reddit', post.id, post.id, post.author.name, post.body, post.timestamp, () => {
                const id = post.id
                const chat_id = post.id
                const senderId = post.author_fullname
                const author = post.author
                const body = post.selftext
                const timestamp = post.created_utc
                const resp = await handleInput(body, author, customConfig.instance.get('agent') ?? "Agent", null, 'reddit', chat_id);
                await handleMessage(resp, id, chat_id, 'isPost', reddit);
                const date = new Date(post.created)
                const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

                database.instance.addMessageInHistoryWithDate('reddit', chat_id, id, author, body, utcStr)
            })
        }
    });

    setInterval(async () => {
        (await reddit.getInbox()).forEach(async (message) => {
            const id = message.name;
            const senderId = message.id;
            const author = message.author.name;
            const body = message.body;
            const timestamp = message.created_utc
            if (!author.includes('reddit')) {
                //log('current message: ' + body)
                await database.instance.messageExistsAsyncWitHCallback('reddit', senderId, id, author, body, timestamp, () => {
                    const resp = await handleInput(body, author, customConfig.instance.get('agent') ?? "Agent", null, 'reddit', chat_id);
                    await handleMessage(resp, id, chat_id, 'isChat', reddit);
                    const date = new Date(timestamp)
                    const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                    const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

                    database.instance.addMessageInHistoryWithDate('reddit', id, id, author, body, utcStr)
                })
            }
        })
    }, 1000)
}