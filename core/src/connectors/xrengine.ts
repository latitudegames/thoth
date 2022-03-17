/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
/* eslint-disable require-await */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TODO: This was imported fropm our old codebase
// We need to break some of this code out so that we have more control of it in the node graph
// i.e. text classification and such

import { random } from 'lodash'
import Xvfb from 'xvfb'

import roomManager from '../components/agent/roomManager'
import { classifyText } from '../utils/textClassifier'
import { browserWindow, PageUtils } from './browser'
import { database } from './database'
import { handleCustomInput } from './handleInput'
import {
  detectOsOption,
  getRandomEmptyResponse,
  getSetting,
  randomInt,
  startsWithCapital,
} from './utils'

export class xrengine_client {
  UsersInRange = {}
  UsersInHarassmentRange = {}
  UsersInIntimateRange = {}
  UsersLookingAt = {}

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
      // roomManager.instance.removeUser(user, 'discord')
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
    //   'xr-engine',
    //   chatId,
    //   messageId,
    //   senderName,
    //   content
    // )
  }
  async deleteMessageFromHistory(chatId, messageId) {
    // await database.instance.deleteMessage('xr-engine', chatId, messageId)
  }
  async updateMessage(chatId, messageId, newContent) {
    // await database.instance.updateMessage(
    //   'xr-engine',
    //   chatId,
    //   messageId,
    //   newContent,
    //   true
    // )
  }
  async wasHandled(chatId, messageId, foundCallback, notFoundCallback) {
    notFoundCallback()
    return false

    return await database.instance.messageExistsWithCallback(
      'xr-engine',
      chatId,
      messageId,
      foundCallback,
      notFoundCallback
    )
  }

  async saveIfHandled(chatId, messageId, sender, content, timestamp) {
    return await database.instance.messageExists(
      'xr-engine',
      chatId,
      messageId,
      sender,
      content,
      timestamp
    )
  }

  isInRange(user) {
    return (
      this.UsersInRange[user] !== undefined ||
      this.UsersInHarassmentRange[user] !== undefined ||
      this.UsersInIntimateRange[user] !== undefined
    )
  }

  async handleMessage(
    id,
    sender,
    senderId,
    channelId,
    text,
    updatedAt,
    bot,
    isVoice
  ) {
    if (text.includes('[') && text.includes(']')) return
    else if (text.includes('joined the layer')) {
      const user = text.replace('joined the layer', '')

      const response = await handleCustomInput(
        '[welcome]' + user,
        _sender,
        this.agent.name ?? 'Agent',
        null,
        'xr-engine',
        channelId,
        true
      )
      await this.handleXREngineResponse(response, addPing, _sender, isVoice)
    } else if (text.includes('left the layer') || text.length === 0) return
    else if (text.includes('in harassment range with')) return
    else if (text.includes('in range with')) return
    else if (text.includes('looking at')) return
    else if (text.includes('in intimate range')) return
    else if (text.startsWith('/') || text.startsWith(' /')) return
    else if (sender === bot.name || senderId === bot.userId) {
      this.addMessageToHistory(channelId, id, this.agent.name, text)
      return
    }
    await this.wasHandled(
      channelId,
      id,
      () => {
        return
      },
      async () => {
        console.log('message: ', text)
        const date = Date.now() / 1000
        const msgDate = updatedAt
        const diff = date - msgDate
        const hours_diff = Math.ceil(diff / 3600)
        const mins_diff = Math.ceil((diff - hours_diff) / 60)
        if (mins_diff > 12 || (mins_diff <= 5 && hours_diff > 1)) {
          const date = new Date(msgDate)
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
          this.saveIfHandled(channelId, id, sender, text, utcStr)
          return
        }

        const _sender = sender
        let content = text
        log('handling message: ' + content)
        await this.addMessageToHistory(channelId, id, _sender, content)
        log('Message added to history')
        let addPing = false
        let _prev = undefined
        _prev = this.prevMessage[channelId]
        this.prevMessage[channelId] = _sender
        if (this.prevMessageTimers[channelId] !== undefined)
          clearTimeout(this.prevMessageTimers[channelId])
        this.prevMessageTimers[channelId] = setTimeout(
          () => (this.prevMessage[channelId] = ''),
          120000
        )

        addPing =
          (_prev !== undefined && _prev !== '' && _prev !== _sender) ||
          this.moreThanOneInConversation()

        let startConv = false
        let startConvName = ''
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
          .match(bot.username_regex)
        const isInDiscussion = this.isInConversation(_sender)
        if (!content.startsWith('!')) {
          if (isUserNameMention) {
            log('is user mention')
            content = '!ping ' + content.replace(bot.username_regex, '').trim()
          } else if (isInDiscussion || startConv) content = '!ping ' + content
        }

        if (content.startsWith('!ping')) this.sentMessage(_sender)
        else {
          if (content === '!ping ' || !content.startsWith('!ping')) {
            // if (true) {
            //roomManager.instance.agentCanResponse(user, 'xrengine')) {
            content = '!ping ' + content
            this.sentMessage(_sender)
            // } else {
            //   const oldChat = database.instance.getConversation(
            //     defaultAgent,
            //     _sender,
            //     'xrengine',
            //     msg.chat.id,
            //     false
            //   )
            //   if (oldChat !== undefined && oldChat.length > 0) {
            //     const context = await classifyText(values)
            //     const ncontext = await classifyText(content)
            //     log('c1: ' + context + ' c2: ' + ncontext)

            //     if (context == ncontext) {
            //       roomManager.instance.userTalkedSameTopic(_sender, 'xrengine')
            //       if (
            //         roomManager.instance.agentCanResponse(_sender, 'xrengine')
            //       ) {
            //         content = '!ping ' + content
            //         this.sentMessage(_sender)
            //       } else {
            //         return
            //       }
            //     } else {
            //       return
            //     }
            //   }
            // }
          } else {
            // roomManager.instance.userGotInConversationFromAgent(_sender)
          }
        }
        log('content: ' + content + ' sender: ' + _sender)

        const response = await handleCustomInput(
          content.replace('!ping', ''),
          _sender,
          this.agent.name ?? 'Agent',
          null,
          'xr-engine',
          channelId,
          isVoice
        )
        await this.handleXREngineResponse(response, addPing, _sender, isVoice)
      }
    )
  }

  async handleMessages(messages, bot) {
    console.log('handle messages:', messages)
    for (let i = 0; i < messages.length; i++) {
      this.handleMessage(
        messages[i].id,
        messages[i].sender.name,
        messages[i].sender.userId,
        messages[i].channelId,
        messages[i].text,
        messages[i].updatedAt,
        bot,
        false
      )
    }
  }

  async handleXREngineResponse(responses, addPing, _sender, isVoice) {
    log('response: ' + responses)
    if (!isVoice) {
      if (
        responses !== undefined &&
        responses.length <= 2000 &&
        responses.length > 0
      ) {
        let text = responses
        while (
          text === undefined ||
          text === '' ||
          text.replace(/\s/g, '').length === 0
        )
          text = getRandomEmptyResponse()
        if (addPing) text = _sender + ' ' + text
        this.xrengineBot.sendMessage(text)
      } else if (
        responses &&
        responses !== undefined &&
        responses.length > 2000
      ) {
        const lines = []
        let line = ''
        for (let i = 0; i < responses.length; i++) {
          line += responses
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
              if (addPing) {
                text = _sender + ' ' + text
                addPing = false
              }
              this.xrengineBot.sendMessage(text)
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
        if (addPing) emptyResponse = _sender + ' ' + emptyResponse
        this.xrengineBot.sendMessage(emptyResponse)
      }
    } else {
      this.xrengineBot.sendAudio(5, responses)
    }
  }

  doTests = false
  xrengineBot = null
  agent
  settings

  async createXREngineClient(agent, settings, cli) {
    console.log('createXREngineClient', agent)
    this.agent = agent
    this.settings = settings
    //generateVoice('hello there', (buf, path) => {}, false)
    log('creating xr engine client')

    this.xrengineBot = new XREngineBot({
      headless: true,
      agent: agent,
      settings: settings,
      xrengineclient: this,
    })

    const xvfb = new Xvfb()
    await xvfb.start(async function (err, xvfbProcess) {
      if (err) {
        log(err)
        xvfb.stop(function (_err) {
          if (_err) log(_err)
        })
      }

      log('started virtual window')
      log('Preparing to connect to ', settings.url)
      cli.xrengineBot.delay(3000 + Math.random() * 1000)
      log('Connecting to server...')
      await cli.xrengineBot.launchBrowser()
      const XRENGINE_URL =
        (settings.url as string) || 'https://n3xus.city/location/test '
      cli.xrengineBot.enterRoom(XRENGINE_URL, { name: 'TestBot' })
      log('bot fully loaded')
    })
  }
}

/**
 * Main class for creating a bot.
 */
class XREngineBot {
  activeChannel
  headless
  name
  autoLog
  fakeMediaPath
  page
  browser
  pu
  userId
  chatHistory = []
  avatars = [
    'Alissa',
    'Cornelius',
    'James_ReadyPlayerMe',
    'Jamie',
    'Mogrid',
    'Warrior',
  ]
  username_regex
  agent
  settings
  xrengineclient: xrengine_client
  constructor({
    name = 'Bot',
    fakeMediaPath = '',
    headless = true,
    autoLog = true,
    agent,
    settings,
    xrengineclient,
  } = {}) {
    this.headless = headless
    this.name = name
    this.autoLog = autoLog
    this.fakeMediaPath = fakeMediaPath
    this.agent = agent
    this.settings = settings
    this.xrengineclient = xrengineclient
    setInterval(() => this.instanceMessages(), 1000)
  }

  async sendMessage(message) {
    log('sending message: ' + message)
    if (message === null || message === undefined) return

    // TODO:
    // Send message to google cloud speech
    // Get response URL from google cloud speech

    // await this.sendAudio(5)

    await this.typeMessage('newMessage', message, false)
    await this.pressKey('Enter')
  }

  async sendMovementCommand(x, y, z) {
    if (x === undefined || y === undefined || z == undefined) {
      log(`Invalid parameters! (${x},${y},${z})`)
      return
    }

    var _x = parseFloat(x)
    var _y = parseFloat(y)
    var _z = parseFloat(z)
    await this._sendMovementCommand(_x, _y, _z)
  }
  async _sendMovementCommand(x, y, z) {
    if (x === undefined || y === undefined || z === undefined) {
      log(`Invalid parameters! (${x},${y},${z})`)
      return
    }

    var message = '/move ' + x + ',' + y + ',' + z
    await this.sendMessage(message)
  }
  async requestSceneMetadata() {
    await this.sendMessage('/metadata scene')
  }
  async requestWorldMetadata(maxDistance) {
    if (maxDistance === undefined || maxDistance <= 0) return

    await this.sendMessage(`/metadata world,${maxDistance}`)
  }
  async requestAllWorldMetadata() {
    await this.requestWorldMetadata(Number.MAX_SAFE_INTEGER)
  }
  async requestPlayers() {
    await this.sendMessage('/listAllusers ')
  }

  removeSystemFromChatMessage(text) {
    return text.substring(text.indexOf(']', 0) + 1)
  }
  async goTo(landmark) {
    if (landmark === undefined || landmark === '') return

    await this.sendMessage(`/goTo ${landmark}`)
  }
  async playEmote(emote) {
    if (emote === undefined || emote === '') return

    await this.sendMessage(`/emote ${emote}`)
  }
  async playFaceExpression(types, perc, time) {
    if (types === undefined || types.length <= 0) return
    if (types.length !== perc.length) return

    var message = '/face '
    for (var i = 0; i < types.length; i++)
      message += types[i] + ' ' + perc[i] + ' '
    message += time

    await this.sendMessage(message)
  }
  async getPosition(player) {
    if (player === undefined || player === '') return

    await this.sendMessage(`/getPosition ${player}`)
  }
  async getRotation(player) {
    if (player === undefined || player === '') return

    await this.sendMessage(`/getRotation ${player}`)
  }
  async getScale(player) {
    if (player === undefined || player === '') return

    await this.sendMessage(`/getScale ${player}`)
  }
  async getTransform(player) {
    if (player === undefined || player === '') return

    await this.sendMessage(`getTransform ${player}`)
  }
  async subscribeToChatSystem(system) {
    if (system === undefined || system === '') return

    await this.sendMessage(`/subscribe ${system}`)
  }
  async unsubscribeFromChatSystem(system) {
    if (system === undefined || system === '') return

    await this.sendMessage(`/unsubscribe ${system}`)
  }
  async getSubscribedChatSystems() {
    await this.sendMessage('/getSubscribed')
  }
  async follow(player) {
    if (player === undefined || player === '') return

    await this.sendMessage(`/follow ${player}`)
  }
  async getChatHistory() {
    await this.sendMessage('/getChatHistory')
  }
  async getLocalUserId() {
    await this.sendMessage('/getLocalUserId')
  }

  counter = 0
  async instanceMessages() {
    //#region  Tests
    // if (doTests) {
    //     this.counter++
    //     if (this.counter === 10) this.playEmote('dance1')
    //     if (this.counter === 20) this.requestSceneMetadata()
    //     if (this.counter === 25) this.sendMovementCommand(1, 1, 1)
    //     //if (this.counter === 35) this.requestWorldMetadata(5)
    //     //if (this.counter === 40) this.requestAllWorldMetadata()
    //     if (this.counter === 25) this.sendMovementCommand(2, 2, 2)
    //     //if (this.counter === 50) this.follow('alex')
    //     //if (this.counter === 60) this.follow('stop')
    //     //if (this.counter === 70) this.goTo('Window')
    //    // if (this.counter === 75) this.getChatHistory()
    //     //if (this.counter === 80) this.requestPlayers()
    // }
    //#endregion

    let active = false

    while (!active) {
      try {
        await this.updateChannelState()
        active = true
      } catch {
        // console.error("Trying to update but can't")
      }
    }

    if (!this.activeChannel) return log('No active channel')
    const messages = this.activeChannel.messages
    if (messages === undefined || messages === null) return

    for (var i = 0; i < messages.length; i++) {
      //messages[i].text = this.removeSystemFromChatMessage(messages[i].text)
      const messageId = messages[i].id
      const senderId = messages[i].sender.id
      var sender = messages[i].sender.name
      //var text = message.text

      delete messages[i].senderId
      delete messages[i].sender
      messages[i].senderName = sender
      messages[i].updatedAt = new Date(messages[i].updatedAt).getTime() / 1000
      messages[i].createdAt = new Date(messages[i].createdAt).getTime() / 1000
      messages[i].author = ['xr-engine', senderId]

      if (
        this.chatHistory.includes(messageId) ||
        this.userId === senderId ||
        (database.instance &&
          (await database.instance.isUserBanned(senderId, 'xr-engine')))
      ) {
        const index = await this.getMessageIndex(messages, messageId)
        if (index > -1) messages.splice(index, 1)
      }

      this.chatHistory.push(messageId)
    }

    await handleMessages(messages, this)
    return this.activeChannel && messages
  }

  async getMessageIndex(messages, messageId) {
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].id === messageId) return i
    }

    return -1
  }

  async sendAudio(duration, url) {
    log('Sending audio...')

    await this.evaluate(url => {
      var audio = document.createElement('audio')
      audio.setAttribute(
        'src',
        url
        //'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3'
      )
      audio.setAttribute('crossorigin', 'anonymous')
      audio.setAttribute('controls', '')
      audio.onplay = function () {
        var stream = audio.captureStream()
        navigator.mediaDevices.getUserMedia = async function () {
          return stream
        }
      }
      document.querySelector('body').appendChild(audio)
      // setTimeout(() => {
      //     document.querySelector("body").removeChild(audio);

      // }, duration)
      audio.play()
    }, url)
    await this.clickElementById('button', 'UserAudio')
    await this.waitForTimeout(duration)
  }

  async stopAudio(bot) {
    log('Stop audio...')
    await this.clickElementById('button', 'UserAudio')
  }

  async recvAudio(duration) {
    log('Receiving audio...')
    await this.waitForSelector('[class*=PartyParticipantWindow]', duration)
  }

  async sendVideo(duration) {
    log('Sending video...')
    await this.clickElementById('button', 'UserVideo')
    await this.waitForTimeout(duration)
  }

  async stopVideo(bot) {
    log('Stop video...')
    await this.clickElementById('button', 'UserVideo')
  }

  async recvVideo(duration) {
    log('Receiving video...')
    await this.waitForSelector('[class*=PartyParticipantWindow]', duration)
  }

  async delay(timeout) {
    log(`Waiting for ${timeout} ms... `)
    await this.waitForTimeout(timeout)
  }

  async interactObject() { }

  /** Return screenshot
   * @param {Function} fn Function to execut _in the node context._
   */
  async screenshot() {
    return await this.page.screenshot()
  }

  /** Runs a function and takes a screenshot if it fails
   * @param {Function} fn Function to execut _in the node context._
   */
  async catchAndScreenShot(fn, path = 'botError.png') {
    try {
      await fn()
    } catch (e) {
      if (this.page) {
        warn('Caught error. Trying to screenshot')
        this.page.screenshot({ path })
      }
      error(e)
    }
  }

  /**
   * Runs a function in the browser context
   * @param {Function} fn Function to evaluate in the browser context
   * @param args The arguments to be passed to fn. These will be serialized when passed through puppeteer
   */
  async evaluate(fn, ...args) {
    if (!this.browser) {
      await this.launchBrowser()
    }
    return await this.page.evaluate(fn, ...args)
  }

  /**
   * A main-program type wrapper. Runs a function and quits the bot with a
   * screenshot if the function throws an exception
   * @param {Function} fn Function to evaluate in the node context
   */
  exec(fn) {
    this.catchAndScreenShot(() => fn(this)).catch(e => {
      error('Failed to run. Check botError.png if it exists. Error:', e)
    })
  }

  /** Launches the puppeteer browser instance. It is not necessary to call this
   *  directly in most cases. It will be done automatically when needed.
   */
  async launchBrowser() {
    log('Launching browser')
    const options = {
      headless: this.headless,
      ignoreHTTPSErrors: true,
      args: [
        '--disable-gpu',
        '--use-fake-ui-for-media-stream=1',
        '--use-fake-device-for-media-stream=1',
        `--use-file-for-fake-video-capture=${this.fakeMediaPath}/video.y4m`,
        `--use-file-for-fake-audio-capture=${this.fakeMediaPath}/audio.wav`,
        '--disable-web-security=1',
        '--ignoreHTTPSErrors: true',
        //     '--use-fake-device-for-media-stream',
        //     '--use-file-for-fake-video-capture=/Users/apple/Downloads/football_qcif_15fps.y4m',
        //     // '--use-file-for-fake-audio-capture=/Users/apple/Downloads/BabyElephantWalk60.wav',
        '--allow-file-access=1',
      ],
      ignoreDefaultArgs: ['--mute-audio'],
      ...detectOsOption(),
    }

    this.browser = await browserWindow(options)
    this.page = await this.browser.newPage()
    this.page.on('console', async message => {
      if (message.text().startsWith('scene_metadata')) {
        const data = message.text().split('|', 2)
        if (data.length === 2) {
          const _data = data[1]
          log(`Scene Metadata: Data:${_data}`)
          // TODO: Replace me with metadata handler
          // MessageClient.instance.sendMetadata('xr-engine', 'xr-engine', 'xr-engine', data || 'none')
        } else log(`invalid scene metadata length (${data.length}): ${data}`)
      } else if (message.text().startsWith('metadata')) {
        const data = message.text().split('|', 3)
        if (data.length === 3) {
          const xyz = data[1]
          const _data = data[2]
          log(`Metadata: Position: ${xyz}, Data: ${_data}`)
        } else log(`invalid metadata length ${data.length}: ${data}`)
      } else if (message.text().startsWith('players|')) {
        const cmd = message.text().split('|')[0]
        const data = message.text().substring(cmd.length + 1)
        log(`Players: ${data}`)
      } else if (message.text().startsWith('messages|')) {
        const cmd = message.text().split('|')[0]
        const data = message.text().substring(cmd.length + 1)
        log(`Messages: ${data}`)
      } else if (message.text().startsWith('proximity|')) {
        const data = message.text().split('|')
        //log('Proximity Data: ' + data)
        if (data.length === 4) {
          const mode = data[1]
          const player = data[2]
          const value = data[3]

          if (value === 'left') {
            if (mode == 'inRange') {
              UsersInRange[player] = undefined
            } else if (mode == 'intimate') {
              UsersInIntimateRange[player] = undefined
            } else if (mode == 'harassment') {
              UsersInHarassmentRange[player] = undefined
            } else if (mode == 'lookAt') {
              UsersLookingAt[player] = undefined
            }
          } else {
            if (mode == 'inRange') {
              UsersInRange[player] = value
            } else if (mode == 'intimate') {
              UsersInIntimateRange[player] = value
            } else if (mode == 'harassment') {
              UsersInHarassmentRange[player] = value
            } else if (mode == 'lookAt') {
              UsersLookingAt[player] = value
            }
          }
        }
      } else if (message.text().startsWith('localId|')) {
        const cmd = message.text().split('|')[0]
        const data = message.text().substring(cmd.length + 1)
        log('local user id: ' + data)
        if (data !== undefined && data !== '') {
          this.userId = data
        }
      } else if (message.text().startsWith('emotions|')) {
      } else if (message.text().startsWith('BOT_MESSAGE|')) {
        console.log('got new message')
        console.log(message.text())
        const msg = message.text().substring(message.text().indexOf('|') + 2)
        console.log(msg)
        const msgObj = JSON.parse(msg)
        let isVoice = false
        if (msgObj.text.startsWith('voice|')) {
          msgObj.text = msgObj.text.substring(msgObj.text.indexOf('|') + 1)
          isVoice = true
        }

        await this.xrengineclient.handleMessage(
          msgObj.id,
          msgObj.sender,
          msgObj.senderId,
          msgObj.channelId,
          msgObj.text,
          msgObj.updatedAt,
          this,
          isVoice
        )
      } else if (message.text().startsWith('VOICE_MESSAGE|')) {
        const msg = message.text().substring(msgObj.text.indexOf('|') + 1)
        const msgObj = JSON.parse(msg)
        console.log('received voice message:', msgObj)
        await this.xrengineclient.handleMessage(
          randomInt(0, 1000000),
          msgObj.sender,
          msgObj.senderId,
          'voice-xr-engine',
          msgObj.text,
          msgObj.updatedAt,
          this,
          true
        )
      }

      /*if (this.autoLog)
      console.log('>>', message.text())*/
    })

    this.page.setViewport({ width: 0, height: 0 })
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    )

    this.pu = new PageUtils(this)
  }

  async keyPress(key, numMilliSeconds) {
    await this.setFocus('canvas')
    await this.clickElementById('canvas', 'engine-renderer-canvas')
    const interval = setInterval(() => {
      log('Pressing', key)
      this.pressKey(key)
    }, 100)
    return new Promise(resolve =>
      setTimeout(() => {
        log('Clearing button press for ' + key, numMilliSeconds)
        this.releaseKey(key)
        clearInterval(interval)
        resolve()
      }, numMilliSeconds)
    )
  }

  async pressKey(keycode) {
    await this.page.keyboard.down(keycode)
  }

  async releaseKey(keycode) {
    await this.page.keyboard.up(keycode)
  }

  async navigate(url) {
    if (!this.browser) {
      await this.launchBrowser()
    }

    const parsedUrl = new URL(url.includes('https') ? url : `https://${url}`)
    parsedUrl.searchParams.set('bot', 'true')
    log('parsed url is', parsedUrl)
    const context = this.browser.defaultBrowserContext()
    log('permission allow for ', parsedUrl.origin)
    context.overridePermissions(parsedUrl.origin, ['microphone', 'camera'])

    log(`Going to ${parsedUrl}`)
    await this.page.goto(parsedUrl, { waitUntil: 'domcontentloaded' })

    /* const granted = await this.page.evaluate(async () => {
            return (await navigator.permissions.query({ name: 'camera' })).state;
        });
        log('Granted:', granted);*/
  }

  /** Enters the room specified, enabling the first microphone and speaker found
   * @param {string} roomUrl The url of the room to join
   * @param {Object} opts
   * @param {string} opts.name Name to set as the bot name when joining the room
   */
  async enterRoom(roomUrl, { name = 'bot' } = {}) {
    await this.navigate(roomUrl)
    await this.page.waitForSelector('div[class*="instance-chat-container"]', {
      timeout: 100000,
    })

    if (name) {
      this.name = name
    } else {
      name = this.name
    }

    this.username_regex = new RegExp(this.agent.name, 'ig')

    if (this.headless) {
      // Disable rendering for headless, otherwise chromium uses a LOT of CPU
    }

    //@ts-ignore
    if (this.setName != null) this.setName(name)

    await this.page.mouse.click(0, 0)

    await this.delay(10000)

    await this.getUser()
    await this.updateChannelState()

    await this.updateUsername(name)
    await this.delay(10000)
    const index = this.getRandomNumber(0, this.avatars.length - 1)
    log(`avatar index: ${index}`)
    await this.updateAvatar(this.avatars[index])
    await this.requestPlayers()
    await this.getUser()
    await setInterval(() => this.getUser(), 1000)
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  async updateChannelState() {
    this.activeChannel = await this.evaluate(() => {
      const chatState = globalThis.chatState
      if (chatState === undefined) {
        console.log('chat state is undefined')
        return
      }
      const channelState = chatState.channels
      const channels = channelState.channels.value
      const activeChannelMatch = Object.entries(channels).find(
        ([key, channel]) => channels[key].channelType === 'instance'
      )

      if (activeChannelMatch && activeChannelMatch.length > 0) {
        const res = activeChannelMatch[0]

        function deepCopy(obj) {
          var copy

          if (null == obj || 'object' != typeof obj) return obj

          if (obj instanceof Date) {
            copy = new Date()
            copy.setTime(obj.getTime())
            return copy
          }

          if (obj instanceof Array) {
            copy = []
            for (var i = 0, len = obj.length; i < len; i++) {
              copy[i] = deepCopy(obj[i])
            }
            return copy
          }

          if (obj instanceof Object) {
            copy = {}
            for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr])
            }
            return copy
          }

          throw new Error("Unable to copy obj! Its type isn't supported.")
        }

        return res
      } else {
        console.log("Couldn't get chat state")
        return undefined
      }
    })
  }

  async updateUsername(name) {
    if (name === undefined || name === '') return

    await this.clickElementById('SPAN', 'Profile_0')
    await this.typeMessage('username', name, true)
    await this.pressKey('Enter')
    await this.clickElementById('SPAN', 'Profile_0')
  }

  async updateAvatar(avatar) {
    /*
    log(`updating avatar to: ${avatar}`)
    await this.clickElementById('SPAN', 'Profile_0')
    await this.clickElementById('button', 'CreateIcon')
    await this.clickSelectorByAlt('img', avatar)*/
    //await this.clickElementById('button', 'confirm-avatar')
  }

  async getUser() {
    this.userId = await this.evaluate(() => {
      return globalThis.userId
    })
  }

  async waitForTimeout(timeout) {
    return await new Promise(resolve => setTimeout(() => resolve(), timeout))
  }

  async waitForSelector(selector, timeout) {
    return this.page.waitForSelector(selector, { timeout })
  }

  async clickElementByClass(elemType, classSelector) {
    await this.pu.clickSelectorClassRegex(elemType || 'button', classSelector)
  }

  async clickElementById(elemType, id) {
    await this.pu.clickSelectorId(elemType, id)
  }
  async clickSelectorByAlt(elemType, title) {
    await this.pu.clickSelectorByAlt(elemType, title)
  }

  async typeMessage(input, message, clean) {
    if (clean)
      await this.page.click(`input[name="${input}"]`, { clickCount: 3 })
    await this.page.type(`input[name=${input}`, message)
    //await this.page.keyboard.type(message);
  }

  async setFocus(selector) {
    await this.page.focus(selector)
  }

  /**
   * Leaves the room and closes the browser instance without exiting node
   */
  quit() {
    if (this.page) {
      this.page.close()
    }
    if (this.browser) {
      this.browser.close()
    }
  }
}

function log(text: string) {
  // console.log(text)
}
