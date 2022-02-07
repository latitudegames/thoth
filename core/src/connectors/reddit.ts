/* eslint-disable no-prototype-builtins */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import SnooStream from 'snoostream'
import * as snoowrap from 'snoowrap'

import { database } from '../superreality/database'
import { getSetting } from '../superreality/utils'
import { handleInput } from './handleInput'

export let reddit

export const prevMessage = {}
export const prevMessageTimers = {}
export const messageResponses = {}
export const conversation = {}

export class reddit_client {
  reddit
  prevMessage = {}
  prevMessageTimers = {}
  messageResponses = {}
  conversation = {}

  onMessageDeleted(channel, messageId) {
    if (
      this.messageResponses[channel] !== undefined &&
      this.messageResponses[channel][messageId] !== undefined
    ) {
      delete this.messageResponses[channel][messageId]
    }
  }
  onMessageResponseUpdated(channel, messageId, newResponse) {
    if (this.messageResponses[channel] === undefined)
      this.messageResponses[channel] = {}
    this.messageResponses[channel][messageId] = newResponse
  }

  getMessage(channel, messageId) {
    return channel.messages.fetchMessage(messageId)
  }

  isInConversation(user) {
    return (
      this.conversation[user] !== undefined &&
      this.conversation[user].isInConversation === true
    )
  }

  sentMessage(user) {
    for (const c in this.conversation) {
      if (c === user) continue
      if (
        this.conversation[c] !== undefined &&
        this.conversation[c].timeOutFinished === true
      ) {
        this.exitConversation(c)
      }
    }

    if (this.conversation[user] === undefined) {
      this.conversation[user] = {
        timeoutId: undefined,
        timeOutFinished: true,
        isInConversation: true,
      }
      if (this.conversation[user].timeoutId !== undefined)
        clearTimeout(this.conversation[user].timeoutId)
      this.conversation[user].timeoutId = setTimeout(() => {
        if (this.conversation[user] !== undefined) {
          this.conversation[user].timeoutId = undefined
          this.conversation[user].timeOutFinished = true
        }
      }, 480000)
    } else {
      this.conversation[user].timeoutId = setTimeout(() => {
        if (this.conversation[user] !== undefined) {
          this.conversation[user].timeoutId = undefined
          this.conversation[user].timeOutFinished = true
        }
      }, 480000)
    }
  }

  exitConversation(user) {
    if (this.conversation[user] !== undefined) {
      if (this.conversation[user].timeoutId !== undefined)
        clearTimeout(this.conversation[user].timeoutId)
      this.conversation[user].timeoutId = undefined
      this.conversation[user].timeOutFinished = true
      this.conversation[user].isInConversation = false
      delete this.conversation[user]
    }
  }

  getResponse(channel, message) {
    if (this.messageResponses[channel] === undefined) return undefined
    return this.messageResponses[channel][message]
  }

  async handleMessage(response, messageId, chat_id, args, reddit) {
    if (args === 'isChat') {
      this.reddit
        .getMessage(messageId)
        .reply(responses[key])
        .then(res => {
          database.instance.addMessageInHistory(
            'reddit',
            chat_id,
            res.id,
            customConfig.instance.get('botName'),
            response
          )
        })
    } else if (args === 'isPost') {
      this.reddit
        .getSubmission(chat_id)
        .reply(responses[key])
        .then(res => {
          database.instance.addMessageInHistory(
            'reddit',
            chat_id,
            res.id,
            customConfig.instance.get('botName'),
            response
          )
        })
    }
  }

  addMessageToHistory(chatId, messageId, senderName, content) {
    database.instance.addMessageInHistory(
      'reddit-chat',
      chatId,
      messageId,
      senderName,
      content
    )
  }
  async addMessageInHistoryWithDate(
    chatId,
    messageId,
    senderName,
    content,
    timestamp
  ) {
    await database.instance.addMessageInHistoryWithDate(
      'reddit-chat',
      chatId,
      messageId,
      senderName,
      content,
      timestamp
    )
  }
  async deleteMessageFromHistory(chatId, messageId) {
    await database.instance.deleteMessage('reddit-chat', chatId, messageId)
  }
  async updateMessage(chatId, messageId, newContent) {
    await database.instance.updateMessage(
      'reddit-chat',
      chatId,
      messageId,
      newContent,
      true
    )
  }
  async wasHandled(chatId, messageId, sender, content, timestamp) {
    return await database.instance.messageExistsAsync(
      'reddit-chat',
      chatId,
      messageId,
      sender,
      content,
      timestamp
    )
  }

  agent
  settings

  createRedditClient = async (agent, settings) => {
    this.agent = agent
    this.settings = settings

    const appId = getSetting(settings, 'redditAppID')
    const appSecredId = getSetting(settings, 'redditAppSecretID')
    const oauthToken = getSetting(settings, 'redditOathToken')
    //https://github.com/not-an-aardvark/reddit-oauth-helper
    if (!appId || !appSecredId)
      return console.warn('No API token for Reddit bot, skipping')

    const snooWrapOpptions = {
      continueAfterRatelimitError: true,
      requestDelay: 1100,
    }

    this.reddit = new snoowrap({
      userAgent: 'test_db_app',
      clientId: appId,
      clientSecret: appSecredId,
      refreshToken: oauthToken,
    })
    this.reddit.config(snooWrapOpptions)
    const stream = new SnooStream(reddit)
    log('loaded reddit client')

    const regex = new RegExp('((?:carl|sagan)(?: |$))', 'ig')

    const commentStream = stream.commentStream('test_db')
    commentStream.on('post', async (post, match) => {
      let _match
      if (post.hasOwnProperty('body')) {
        _match = post.body.match(regex)
      } else if (post.hasOwnProperty('selftext')) {
        _match = post.selftext.match(regex)
      }

      if (_match) {
        log('got new commend') // - ' + JSON.stringify(post))
        const id = post.id
        const chat_id = post.link_url.split('/')[6]
        const senderId = post.author_fullname
        const author = post.author.name
        const body = post.body
        const timestamp = post.created_utc
        const resp = await handleInput(
          body,
          author,
          customConfig.instance.get('agent') ?? 'Agent',
          null,
          'reddit',
          chat_id
        )
        await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
        const date = new Date(post.created)
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

        database.instance.addMessageInHistoryWithDate(
          'reddit',
          chat_id,
          id,
          author,
          body,
          utcStr
        )
      } else {
        await database.instance.messageExistsAsyncWitHCallback2(
          'reddit',
          post.link_url.split('/')[6],
          post.id,
          post.author.name,
          post.body,
          post.timestamp,
          async () => {
            log('got new commend') // - ' + JSON.stringify(post))
            const id = post.id
            const chat_id = post.link_url.split('/')[6]
            const senderId = post.author_fullname
            const author = post.author
            const body = post.body
            const timestamp = post.created_utc
            const resp = await handleInput(
              body,
              author,
              customConfig.instance.get('agent') ?? 'Agent',
              null,
              'reddit',
              chat_id
            )
            await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
            const date = new Date(post.created)
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

            database.instance.addMessageInHistoryWithDate(
              'reddit',
              chat_id,
              id,
              author,
              body,
              utcStr
            )
          }
        )
      }
    })
    const submissionStream = stream.submissionStream('test_db', {
      regex: '((?:carl|sagan)(?: |$))',
    })
    submissionStream.on('post', async (post, match) => {
      let _match
      if (post.hasOwnProperty('body')) {
        _match = post.body.match(regex)
      } else if (post.hasOwnProperty('selftext')) {
        _match = post.selftext.match(regex)
      }

      if (_match) {
        log('got new post' + JSON.stringify(post))
        const id = post.id
        const chat_id = post.id
        const senderId = post.author_fullname
        const author = post.author.name
        const body = post.selftext
        const timestamp = post.created_utc
        const resp = await handleInput(
          body,
          author,
          customConfig.instance.get('agent') ?? 'Agent',
          null,
          'reddit',
          chat_id
        )
        await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
        const date = new Date(post.created)
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

        database.instance.addMessageInHistoryWithDate(
          'reddit',
          chat_id,
          id,
          author,
          body,
          utcStr
        )
      } else {
        await database.instance.messageExistsAsyncWitHCallback2(
          'reddit',
          post.id,
          post.id,
          post.author.name,
          post.body,
          post.timestamp,
          async () => {
            log('got new post') // - ' + JSON.stringify(post))
            const id = post.id
            const chat_id = post.id
            const senderId = post.author_fullname
            const author = post.author
            const body = post.selftext
            const timestamp = post.created_utc
            const resp = await handleInput(
              body,
              author,
              customConfig.instance.get('agent') ?? 'Agent',
              null,
              'reddit',
              chat_id
            )
            await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
            const date = new Date(post.created)
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

            database.instance.addMessageInHistoryWithDate(
              'reddit',
              chat_id,
              id,
              author,
              body,
              utcStr
            )
          }
        )
      }
    })

    setInterval(async () => {
      ;(await reddit.getInbox()).forEach(async message => {
        const id = message.name
        const senderId = message.id
        const author = message.author.name
        const body = message.body
        const timestamp = message.created_utc
        if (!author.includes('reddit')) {
          //log('current message: ' + body)
          await database.instance.messageExistsAsyncWitHCallback(
            'reddit',
            senderId,
            id,
            author,
            body,
            timestamp,
            async () => {
              log('got new message: ' + body)
              const resp = await handleInput(
                body,
                author,
                customConfig.instance.get('agent') ?? 'Agent',
                null,
                'reddit',
                chat_id
              )
              await this.handleMessage(resp, id, chat_id, 'isChat', reddit)
              const date = new Date(timestamp)
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

              database.instance.addMessageInHistoryWithDate(
                'reddit',
                id,
                id,
                author,
                body,
                utcStr
              )
            }
          )
        }
      })
    }, 1000)
  }
}
