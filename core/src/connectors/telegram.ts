/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable require-await */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TODO: This was imported fropm our old codebase
// We need to break some of this code out so that we have more control of it in the node graph
// i.e. text classification and such

import roomManager from '../components/agent/roomManager'
import { classifyText } from '../utils/textClassifier'
import { database } from './database'
import { handleInput } from './handleInput'
import { getRandomEmptyResponse, getSetting, startsWithCapital } from './utils'

export class telegram_client {
  async handleMessage(chat_id, response, message_id, addPing, args, bot) {
    let senderId = ''
    let senderName = ''
    if (
      args !== 'none' &&
      args.startsWith('[') &&
      args[args.length - 1] === ']'
    ) {
      args = JSON.parse(args)
      senderId = args[0]
      senderName = args[1]
    }
    log('response: ' + response)
    if (response !== undefined && response.length > 0) {
      let text = response
      while (
        text === undefined ||
        text === '' ||
        text.replace(/\s/g, '').length === 0
      )
        text = getRandomEmptyResponse()
      if (addPing)
        bot
          .sendMessage(
            chat_id,
            `<a href="tg://user?id=${senderId}">${senderName}</a> ${text}`,
            { parse_mode: 'HTML' }
          )
          .then(function (_resp) {
            this.onMessageResponseUpdated(
              _resp.chat.id,
              message_id,
              _resp.message_id
            )
            this.addMessageToHistory(
              _resp.chat.id,
              _resp.message_id,
              this.agent.name,
              text
            )
          })
          .catch(console.error)
      else
        bot
          .sendMessage(chat_id, text)
          .then(function (_resp) {
            this.onMessageResponseUpdated(
              _resp.chat.id,
              message_id,
              _resp.message_id
            )
            this.addMessageToHistory(
              _resp.chat.id,
              _resp.message_id,
              this.agent.name,
              text
            )
          })
          .catch(console.error)
    } else {
      let emptyResponse = getRandomEmptyResponse()
      while (
        emptyResponse === undefined ||
        emptyResponse === '' ||
        emptyResponse.replace(/\s/g, '').length === 0
      )
        emptyResponse = getRandomEmptyResponse()
      if (addPing)
        bot
          .sendMessage(
            chat_id,
            `<a href="tg://user?id=${senderId}">${senderName}</a> ${emptyResponse}`,
            { parse_mode: 'HTML' }
          )
          .then(function (_resp) {
            this.onMessageResponseUpdated(
              _resp.chat.id,
              message_id,
              _resp.message_id
            )
            this.addMessageToHistory(
              _resp.chat.id,
              _resp.message_id,
              this.agent.name,
              emptyResponse
            )
          })
          .catch(console.error)
      else
        bot
          .sendMessage(chat_id, emptyResponse)
          .then(function (_resp) {
            this.onMessageResponseUpdated(
              _resp.chat.id,
              message_id,
              _resp.message_id
            )
            this.addMessageToHistory(
              _resp.chat.id,
              _resp.message_id,
              this.agent.name,
              emptyResponse
            )
          })
          .catch(console.error)
    }
  }

  async handleEditMessage(chat_id, message_id, response, args, bot) {
    let senderId = ''
    let senderName = ''
    if (
      args !== 'none' &&
      args.startsWith('[') &&
      args[args.length - 1] === ']'
    ) {
      args = JSON.parse(args)
      senderId = args[0]
      senderName = args[1]
    }
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
      bot
        .sendMessage(
          chat_id,
          `<a href="tg://user?id=${senderId}">${senderName}</a> ${text}`,
          { parse_mode: 'HTML' }
        )
        .then(function (_resp) {
          this.onMessageResponseUpdated(
            _resp.chat.id,
            message_id,
            _resp.message_id
          )
          this.addMessageToHistory(
            _resp.chat.id,
            _resp.message_id,
            telegramPacketHandler.instance.botName,
            text
          )
        })
        .catch(console.error)
    } else if (response.length > 2000) {
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
            bot
              .sendMessage(
                chat_id,
                `<a href="tg://user?id=${senderId}">${senderName}</a> ${text}`,
                { parse_mode: 'HTML' }
              )
              .then(function (_resp) {
                this.onMessageResponseUpdated(
                  _resp.chat.id,
                  message_id,
                  _resp.message_id
                )
                this.addMessageToHistory(
                  _resp.chat.id,
                  _resp.message_id,
                  telegramPacketHandler.instance.botName,
                  text
                )
              })
              .catch(console.error)
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
      bot
        .sendMessage(
          chat_id,
          `<a href="tg://user?id=${senderId}">${senderName}</a> ${emptyResponse}`,
          { parse_mode: 'HTML' }
        )
        .then(function (_resp) {
          this.onMessageResponseUpdated(
            _resp.chat.id,
            message_id,
            _resp.message_id
          )
          this.addMessageToHistory(
            _resp.chat.id,
            _resp.message_id,
            telegramPacketHandler.instance.botName,
            emptyResponse
          )
        })
        .catch(console.error)
    }
  }

  async onMessageEdit(bot, msg, botName) {
    if (await database.instance.isUserBanned(msg.from.id + '', 'telegram'))
      return
    log('edited_message: ' + JSON.stringify(msg))
    const date = Date.now() / 1000
    const msgDate = msg.date
    const diff = date - msgDate
    const hours_diff = Math.ceil(diff / 3600)
    const mins_diff = Math.ceil((diff - hours_diff) / 60)
    if (mins_diff > 12 || (mins_diff <= 12 && hours_diff > 1)) return
    const _sender =
      msg.from.username === undefined ? msg.from.first_name : msg.from.username

    this.updateMessage(msg.chat.id, msg.message_id, msg.text)
    if (msg.from.is_bot) return

    const oldResponse = this.getResponse(msg.chat.id, msg.message_id)
    if (oldResponse === undefined) return

    const resp = handleInput(
      msg.text,
      msg.from.first_name,
      'Agent',
      'telegram',
      msg.chat.id
    )
    await this.handleEditMessage(
      msg.chat.id,
      msg.message_id,
      resp,
      "[ '" + msg.from.id + "', '" + msg.from.first_name + "' ]",
      bot
    )
  }

  async onMessage(bot, msg, botName, username_regex) {
    this.addMessageToHistory(
      msg.chat.id,
      msg.message_id,
      msg.from.username === undefined ? msg.from.first_name : msg.from.username,
      msg.text
    )
    log(JSON.stringify(msg))
    const date = Date.now() / 1000
    const msgDate = msg.date
    const diff = date - msgDate
    const hours_diff = Math.ceil(diff / 3600)
    const mins_diff = Math.ceil((diff - hours_diff) / 60)
    if (mins_diff > 12 || (mins_diff <= 12 && hours_diff > 1)) return

    if (await database.instance.isUserBanned(msg.from.id + '', 'telegram'))
      return
    let content = msg.text
    const _sender =
      msg.from.username === undefined ? msg.from.first_name : msg.from.username
    this.addMessageToHistory(msg.chat.id, msg.message_id, _sender, content)
    let addPing = false
    if (msg.chat.type == 'supergroup') {
      if (content === '') content = '{sent media}'
      let isReply = false
      if (msg.reply_to_message !== undefined) {
        if (msg.reply_to_message.from.username === botName) isReply = true
        else {
          this.exitConversation(_sender)
          const _replyTo =
            msg.reply_to_message.from.username === undefined
              ? msg.reply_to_message.from.first_name
              : msg.reply_to_message.from.username
          this.exitConversation(_replyTo)
          return
        }
      }
      let _prev = undefined
      if (!msg.from.is_bot) {
        _prev = prevMessage[msg.chat.id]
        this.prevMessage[msg.chat.id] = _sender
        if (prevMessageTimers[msg.chat.id] !== undefined)
          clearTimeout(prevMessageTimers[msg.chat.id])
        this.prevMessageTimers[msg.chat.id] = setTimeout(
          () => (prevMessage[msg.chat.id] = ''),
          120000
        )
      }
      addPing =
        (_prev !== undefined && _prev !== '' && _prev !== _sender) ||
        this.moreThanOneInConversation()

      const isMention =
        msg.entities !== undefined &&
        msg.entities.length === 1 &&
        msg.entities[0].type === 'mention' &&
        content.includes('@' + getSetting(this.settings, 'telegramBotName'))
      const otherMention =
        msg.entities !== undefined &&
        msg.entities.length > 0 &&
        msg.entities[0].type === 'mention' &&
        !content.includes('@' + getSetting(this.settings, 'telegramBotName'))
      let startConv = false
      let startConvName = ''
      if (!isMention && !otherMention) {
        const trimmed = content.trimStart()
        if (trimmed.toLowerCase().startsWith('hi')) {
          const parts = trimmed.split(' ')
          if (parts.length > 1) {
            if (!startsWithCapital(parts[1])) {
              startConv = true
            } else {
              startConv = false
              startConvName = parts[1]
            }
          } else {
            if (trimmed.toLowerCase() === 'hi') {
              startConv = true
            }
          }
        }
      }
      if (otherMention) {
        this.exitConversation(_sender)
        for (let i = 0; i < msg.entities.length; i++) {
          if (msg.entities[i].type === 'mention') {
            const _user = msg.text.slice(
              msg.entities[i].offset + 1,
              msg.entities[i].length
            )
            this.exitConversation(_user)
          }
        }
      }
      if (!startConv) {
        if (startConvName.length > 0) {
          this.exitConversation(_sender)
          this.exitConversation(startConvName)
        }
      }

      const isUserNameMention = content
        .toLowerCase()
        .replace(',', '')
        .replace('.', '')
        .replace('?', '')
        .replace('!', '')
        .match(username_regex)
      const isInDiscussion = this.isInConversation(_sender)
      if (!content.startsWith('!') && !otherMention) {
        if (isMention) content = '!ping ' + content.replace('!', '').trim()
        else if (isUserNameMention)
          content = '!ping ' + content.replace(username_regex, '').trim()
        else if (isInDiscussion || startConv || isReply)
          content = '!ping ' + content
      }

      if (!otherMention && content.startsWith('!ping')) sentMessage(_sender)

      if (otherMention) {
        roomManager.instance.userPingedSomeoneElse(_sender, 'telegram')
      }
    } else {
      content = '!ping ' + content
    }

    if (content === '!ping ' || !content.startsWith('!ping')) {
      if (roomManager.instance.agentCanResponse(user, 'telegram')) {
        content = '!ping ' + content
        this.sentMessage(_sender)
      } else {
        const oldChat = database.instance.getConversation(
          defaultAgent,
          _sender,
          'telegram',
          msg.chat.id,
          false
        )
        if (oldChat !== undefined && oldChat.length > 0) {
          const context = await classifyText(values)
          const ncontext = await classifyText(content)
          log('c1: ' + context + ' c2: ' + ncontext)

          if (context == ncontext) {
            roomManager.instance.userTalkedSameTopic(_sender, 'telegram')
            if (roomManager.instance.agentCanResponse(_sender, 'telegram')) {
              content = '!ping ' + content
              this.sentMessage(_sender)
            } else {
              return
            }
          } else {
            return
          }
        }
      }
    } else {
      roomManager.instance.userGotInConversationFromAgent(_sender)
    }

    const resp = handleInput(
      msg.text,
      msg.from.first_name,
      'Agent',
      'telegram',
      msg.chat.id
    )
    await this.handleEditMessage(
      msg.chat.id,
      msg.message_id,
      resp,
      addPing
        ? "[ '" + msg.from.id + "', '" + msg.from.first_name + "' ]"
        : 'none',
      bot
    )
  }

  prevMessage = {}
  prevMessageTimers = {}
  messageResponses = {}
  conversation = {}
  chatHistory = {}

  onMessageDeleted(chatId, messageId) {
    if (
      this.messageResponses[chatId] !== undefined &&
      this.messageResponses[chatId][messageId] !== undefined
    ) {
      delete this.messageResponses[chatId][messageId]
    }
  }
  onMessageResponseUpdated(chatId, messageId, newResponse) {
    if (this.messageResponses[chatId] === undefined)
      this.messageResponses[chatId] = {}
    this.messageResponses[chatId][messageId] = newResponse
  }

  getMessage(chatId, messageId) {
    return chatId.messages.fetchMessage(messageId)
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
        vexitConversation(c)
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
        log('conversation for ' + user + ' ended')
        if (this.conversation[user] !== undefined) {
          this.conversation[user].timeoutId = undefined
          this.conversation[user].timeOutFinished = true
        }
      }, 720000)
    } else {
      this.conversation[user].timeoutId = setTimeout(() => {
        log('conversation for ' + user + ' ended')
        if (this.conversation[user] !== undefined) {
          this.conversation[user].timeoutId = undefined
          this.conversation[user].timeOutFinished = true
        }
      }, 720000)
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
      roomManager.instance.removeUser(user, 'discord')
    }
  }

  moreThanOneInConversation() {
    let count = 0
    for (const c in this.conversation) {
      if (this.conversation[c] === undefined) continue
      if (
        this.conversation[c].isInConversation !== undefined &&
        this.conversation[c].isInConversation === true &&
        this.conversation[c].timeOutFinished === false
      )
        count++
    }

    return count > 1
  }

  getResponse(chatId, message) {
    if (this.messageResponses[chatId] === undefined) return undefined
    return this.messageResponses[chatId][message]
  }

  async addMessageToHistory(chatId, messageId, senderName, content) {
    return
    // await database.instance.addMessageInHistory(
    //   'telegram',
    //   chatId,
    //   messageId,
    //   senderName,
    //   content
    // )
  }

  async updateMessage(chatId, messageId, newContent) {
    // await database.instance.updateMessage(
    //   'telegram',
    //   chatId,
    //   messageId,
    //   newContent,
    //   true
    // )
  }

  agent
  settings

  createTelegramClient = async (agent, settings) => {
    this.agent = agent
    this.settings = settings

    const token = getSetting(settings, 'telegramBotToken')

    if (!token) return console.warn('No API token for Telegram bot, skipping')
    const username_regex = new RegExp(
      'botNameRegex',
      'ig'
    )
    let botName = ''

    const bot = new TelegramBot(token, { polling: true })
    bot
      .getMe()
      .then(info => (botName = info.username))
      .catch(console.error)

    bot.on('message', async msg => {
      await this.onMessage(bot, msg, botName, username_regex)
    })
    bot.on('edited_message', async msg => {
      await this.onMessageEdit(bot, msg, botName)
    })
    log('telegram client loaded')
  }
}
