/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable require-await */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// required for message.lineReply
import Discord, { Intents } from 'discord.js'
import emoji from 'emoji-dictionary'
import emojiRegex from 'emoji-regex'
import { EventEmitter } from 'events'

import roomManager from '../components/agent/roomManager'
import { classifyText } from '../utils/textClassifier'
import { database } from './database'
import { handleInput } from './handleInput'
import { getRandomEmptyResponse, startsWithCapital, getSetting } from './utils'

function log(...s) {
  return
  // console.log(...s)
}

export const channelTypes = {
  text: 'GUILD_TEXT',
  dm: 'DM',
  voice: 'GUILD_VOICE',
  thread: 'GUILD_PUBLIC_THREAD',
}
export class discord_client {
  destroy() {
    this.client.destroy()
  }

  //Event that is triggered when a new user is added to the server
  async handleGuildMemberAdd(user) {
    const userId = user.user.id
    const username = user.user.username

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

    // TODO: Replace me with direct message handler
    log('Discord', 'join', username, utcStr)
    // MessageClient.instance.sendUserUpdateEvent('Discord', 'join', username, utcStr)
  }

  //Event that is triggered when a user is removed from the server
  async handleGuildMemberRemove(user) {
    const userId = user.user.id
    const username = user.user.username

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
    // TODO: Replace me with direct message handler
    log('Discord', 'leave', username, utcStr)
    // MessageClient.instance.sendUserUpdateEvent('Discord', 'leave', username, utcStr)
  }

  //Event that is triggered when a user reacts to a message
  async handleMessageReactionAdd(reaction, user) {
    const { message } = reaction
    const emojiName = emoji.getName(reaction.emoji)

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

    // TODO: Replace me with direct message handler
    log(
      'Discord',
      message.channel.id,
      message.id,
      message.content,
      user.username,
      emojiName,
      utcStr
    )
    // MessageClient.instance.sendMessageReactionAdd('Discord', message.channel.id, message.id, message.content, user.username, emojiName, utcStr)
  }

  async agents(client, message, args, author, addPing, channel) {
    log('Discord', message.channel.id)
    // TODO: Replace me with direct message handler
    // MessageClient.instance.sendGetAgents('Discord', message.channel.id)
  }

  //ban command, it is used to ban a user from the agent so the agent doesn't respon to this user
  async ban(client, message, args, author, addPing, channel) {
    const pw = args.parsed_words
    if (pw === undefined || pw.length !== 1) {
      message.channel.send('invalid command structure!')
      message.channel.stopTyping()
      return
    }

    const { mentions } = message
    log(JSON.stringify(mentions))
    if (
      mentions === undefined ||
      mentions.users === undefined ||
      mentions.users.size !== 1
    ) {
      message.channel.send('invalid command structure!')
      message.channel.stopTyping()
      return
    }
    const user = mentions.users.first().id
    await database.instance.banUser(user, 'discord')
    message.channel.send('banned user: ' + `<@!${user}>`)
    message.channel.stopTyping()
  }

  //returns all the current commands for the bot
  async commands(client, message, args, author, addPing, channel) {
    let str = ''
    this.client.helpFields[0].commands.forEach(function (item, index) {
      if (item[3].length <= 2000 && item[3].length > 0) {
        str += '!' + item[0] + ' - ' + item[3] + '\n'
      }
    })
    if (str.length === 0) this.client.embed.description = 'empty response'
    message.channel.send(str)
    message.channel.stopTyping()
  }

  //ping is used to send a message directly to the agent
  async ping(client, message, args, author, addPing, channel) {
    if (
      args.grpc_args.message === undefined ||
      args.grpc_args.message === '' ||
      args.grpc_args.message.replace(/\s/g, '').length === 0
    ) {
      this.client.embed.description = 'Wrong format, !ping message'
      message.channel.send(client.embed)
      this.client.embed.desscription = ''
      message.channel.stopTyping()
      return
    }

    args.grpc_args['client_name'] = 'discord'
    args.grpc_args['chat_id'] = channel

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
    args.grpc_args['createdAt'] = utcStr

    let parentId = ''
    if (args.grpc_args['isThread'] === true) {
      parentId = args.grpc_args['parentId']
    }

    // TODO: Replace me with direct message handler
    // MessageClient.instance.sendMessage(args.grpc_args['message'], message.id, 'Discord', args.grpc_args['chat_id'], utcStr, addPing, author.username, 'parentId:' + parentId)
    log(
      args.grpc_args['message'],
      message.id,
      'Discord',
      args.grpc_args['chat_id'],
      utcStr,
      addPing,
      author.username,
      'parentId:' + parentId
    )
  }

  //ping agent is used to ping a specific agent directly
  async pingagent(client, message, args, author, addPing, channel) {
    if (
      args.grpc_args.message === undefined ||
      args.grpc_args.message === '' ||
      args.grpc_args.message.replace(/\s/g, '').length === 0 ||
      args.grpc_args.message.includes('agent=') ||
      args.grpc_args.agent === undefined ||
      args.grpc_args.agent === '' ||
      args.grpc_args.agent.replace(/\s/g, '').length === 0
    ) {
      this.client.embed.description =
        'Wrong format, !pingagent agent=agent message=value'
      message.channel.send(client.embed)
      this.client.embed.desscription = ''
      message.channel.stopTyping()
      return
    }

    // TODO: Replace me with direct message handler
    log(
      'Discord',
      message.channel.id,
      message.id,
      args.grpc_args['message'],
      args.grpc_args['agent'],
      addPing,
      author.username
    )
    // MessageClient.instance.sendPingSoloAgent('Discord', message.channel.id, message.id, args.grpc_args['message'], args.grpc_args['agent'], addPing, author.username)
  }

  //setagent is used to update an agent
  async setagent(client, message, args, author, addPing, channel) {
    if (args.grpc_args.message === undefined || args.grpc_args.message === '') {
      this.client.embed.description =
        'Wrong format, !setagent agent=agent context=value'
      message.channel.send(client.embed)
      this.client.embed.desscription = ''
      message.channel.stopTyping()
      return
    }
    if (
      args.grpc_args['name'] === undefined ||
      args.grpc_args['name'] === '' ||
      args.grpc_args['context'] === undefined ||
      args.grpc_args['context'] === ''
    ) {
      this.client.embed.description =
        'Wrong format, !setagent agent=agent context=value'
      message.channel.send(client.embed)
      this.client.embed.desscription = ''
      message.channel.stopTyping()
      return
    }

    // TODO: Replace me with direct message handler
    log(
      'Discord',
      message.channel.id,
      args.grpc_args['name'],
      args.grpc_args['context']
    )
    // MessageClient.instance.sendSetAgentsFields('Discord', message.channel.id, args.grpc_args['name'], args.grpc_args['context'])
  }

  //sets the name for an agent to respond for it
  async setname(client, message, args, author, addPing, channel) {
    if (args.parsed_words === undefined || args.parsed_words.length !== 1) {
      message.channel.send('Invalid format, !setname name')
      message.channel.stopTyping()
      return
    }

    const name = args.parsed_words[0]
    this.bot_name = name
    this.client.name_regex = new RegExp(name, 'ig')
    log(client.bot_name + ' - ' + this.client.name_regex)
    message.channel.send('Updated bot name to: ' + name)
    message.channel.stopTyping()
  }

  //unbans a user from the agent's ban list
  async unban(client, message, args, author, addPing, channel) {
    const pw = args.parsed_words
    if (pw === undefined || pw.length !== 1) {
      message.channel.send('invalid command structure!')
      message.channel.stopTyping()
      return
    }

    const { mentions } = message
    log(JSON.stringify(mentions))
    if (
      mentions === undefined ||
      mentions.users === undefined ||
      mentions.users.size !== 1
    ) {
      message.channel.send('invalid command structure!')
      message.channel.stopTyping()
      return
    }
    const user = mentions.users.first().id
    await database.instance.unbanUser(user, 'discord')
    message.channel.send('unbanned user: ' + `<@!${user}>`)
    message.channel.stopTyping()
  }

  //Event that is trigger when a new message is created (sent)
  messageCreate = async (client, message) => {
    log(client, message)
    //gets the emojis from the text and replaces to unix specific type
    const reg = emojiRegex()
    let match
    const emojis = []
    while ((match = reg.exec(message.content)) !== null) {
      emojis.push({ name: emoji.getName(match[0]), emoji: match[0] })
      message.content = message.content.replace(
        match[0],
        match[0] + ' :' + emoji.getName(match[0]) + ':'
      )
    }
    const args = {}
    args['grpc_args'] = {}

    let { author, channel, content, mentions, id } = message

    //replaces the discord specific mentions (<!@id>) to the actual mention
    if (
      mentions !== null &&
      mentions.members !== null &&
      mentions.members.size > 0
    ) {
      const data = content.split(' ')
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].startsWith('<@!') &&
          data[i].charAt(data[i].length - 1) === '>'
        ) {
          try {
            const x = data[i].replace('<@!', '').replace('>', '')
            const user = await this.client.users.cache.find(
              user => user.id == x
            )
            if (user !== undefined) {
              //const u = '@' + user.username + '#' + user.discriminator
              const u =
                user.id == this.client.user
                  ? this.discord_bot_name
                  : user.username
              content = content.replace(data[i], u)
            }
          } catch (err) {
            error(err)
          }
        }
      }
    }

    //if the message is empty it is ignored
    if (content === '') return
    let _prev = undefined

    //if the author is not a bot, it adds the message to the conversation simulation
    if (!author.bot) {
      _prev = this.prevMessage[channel.id]
      this.prevMessage[channel.id] = author
      if (this.prevMessageTimers[channel.id] !== undefined)
        clearTimeout(this.prevMessageTimers[channel.id])
      this.prevMessageTimers[channel.id] = setTimeout(
        () => (this.prevMessage[channel.id] = ''),
        120000
      )
    }
    //if there are many users in the conversation simulation or the previous message is from someone else, it adds a ping
    const addPing =
      (_prev !== undefined && _prev !== '' && _prev !== author) ||
      this.moreThanOneInConversation()
    // Ignore all bots
    if (author.bot) return

    //checks if the message contains a direct mention to the bot, or if it is a DM, or if it mentions someone else
    const botMention = `<@!${client.user}>`
    const isDM = channel.type === channelTypes['dm']
    const isMention =
      (channel.type === channelTypes['text'] && mentions.has(client.user)) ||
      isDM
    const otherMention =
      !isMention && mentions.members !== null && mentions.members.size > 0
    let startConv = false
    let startConvName = ''
    //if it isn't a mention to the bot or another mention or a DM
    //it works with the word hi and the next word should either not exist or start with a lower letter to start the conversation
    if (!isMention && !isDM && !otherMention) {
      const trimmed = content.trimStart()
      for (let i = 0; i < this.discord_starting_words.length; i++) {
        if (trimmed.toLowerCase().startsWith(this.discord_starting_words[i])) {
          const parts = trimmed.split(' ')
          if (parts.length > 1) {
            if (!startsWithCapital(parts[1])) {
              startConv = true
            } else {
              startConv = false
              startConvName = parts[1]
            }
          } else {
            if (trimmed.toLowerCase() === this.discord_starting_words[i]) {
              startConv = true
            }
          }
        }
      }
    }
    //if it is a mention to another user, then the conversation with the bot is ended
    if (otherMention) {
      this.exitConversation(author.id)
      mentions.members.forEach(pinged => this.exitConversation(pinged.id))
    }
    if (!startConv && !isMention) {
      if (startConvName.length > 0) {
        this.exitConversation(author.id)
        this.exitConversation(startConvName)
      }
    }
    //checks if the user is in discussion with the but, or includes !ping or started the conversation, if so it adds (if not exists) !ping in the start to handle the message the ping command
    const isDirectMethion =
      !content.startsWith('!') &&
      content.toLowerCase().includes(this.bot_name?.toLowerCase())
    const isUserNameMention =
      (channel.type === channelTypes['text'] || isDM) &&
      content &&
      content
        .toLowerCase()
        .replace(',', '')
        .replace('.', '')
        .replace('?', '')
        .replace('!', '')
        .match(client.username_regex)
    const isInDiscussion = this.isInConversation(author.id)
    if (!content.startsWith('!') && !otherMention) {
      if (isMention) content = '!ping ' + content.replace(botMention, '').trim()
      else if (isDirectMethion)
        content = '!ping ' + content.replace(client.name_regex, '').trim()
      else if (isUserNameMention) {
        content = '!ping ' + content.replace(client.username_regex, '').trim()
      } else if (isInDiscussion || startConv) content = '!ping ' + content
    }

    if (otherMention) {
      //roomManager.instance.userPingedSomeoneElse(author.id, 'discord')
    } else if (content.startsWith('!ping')) {
      //roomManager.instance.userGotInConversationFromAgent(author.id), 'discord'
    } else if (!content.startsWith('!ping')) {
      if (
        this.discussionChannels[channel.id] !== undefined &&
        this.discussionChannels[channel.id]
      ) {
        if (!this.discussionChannels[channel.id].responded) {
          this.discussionChannels[channel.id].responded = true
          content = '!ping ' + content
        }
      }

      if (!content.startsWith('!ping')) {
        const msgs = await channel.messages.fetch({ limit: 10 })
        if (msgs && msgs.size > 0) {
          let values = ''
          let agentTalked = false
          for (const [key, value] of msgs.entries()) {
            values += value.content
            if (value.author.bot) {
              agentTalked = true
            }
          }

          if (agentTalked) {
            const context = await classifyText(values)
            const ncontext = await classifyText(content)
            log('c1: ' + context + ' c2: ' + ncontext)

            if (context == ncontext) {
              /*roomManager.instance.userTalkedSameTopic(author.id, 'discord')
              if (roomManager.instance.agentCanResponse(author.id, 'discord')) {
                content = '!ping ' + content
              }*/
            }
          }
        }
      }
    }

    //if the message contains join word, it makes the bot to try to join a voice channel and listen to the users
    if (content.startsWith('!ping')) {
      this.sentMessage(author.id)
      const mention = `<@!${client.user.id}>`
      if (
        content.startsWith('!ping join') ||
        content.startsWith('!ping ' + mention + ' join')
      ) {
        const d = content.split(' ')
        const index = d.indexOf('join') + 1
        if (d.length > index) {
          const channelName = d[index]
          await message.guild.channels.cache.forEach(async channel => {
            if (
              channel.type === channelTypes['voice'] &&
              channel.name === channelName
            ) {
              const connection = await channel.join()
              const receiver = connection.receiver
              const userStream = receiver.createStream(author, {
                mode: 'pcm',
                end: 'silence',
              })
              const writeStream = fs.createWriteStream('recording.pcm', {})

              const buffer = []
              userStream.on('data', chunk => {
                buffer.push(chunk)
                log(chunk)
                userStream.pipe(writeStream)
              })
              writeStream.on('pipe', log)
              userStream.on('finish', () => {
                channel.leave()
                /*const cmd = 'ffmpeg -i recording.pcm recording.wav';
                              exec(cmd, (error, stdout, stderr) => {
                                  if (error) {
                                      log(`error: ${error.message}`);
                                      return;
                                  }
                                  if (stderr) {
                                      log(`stderr: ${stderr}`);
                                      return;
                                  }
                                  log(`stdout: ${stdout}`);
                              });*/
              })
              return false
            }
          })
          return
        }
      }
    }

    // Set flag to true to skip using prefix if mentioning or DMing us
    const prefixOptionalWhenMentionOrDM =
      this.client.prefixOptionalWhenMentionOrDM

    const msgStartsWithMention = content.startsWith(botMention)

    const messageContent =
      isMention && msgStartsWithMention
        ? content.replace(botMention, '').trim()
        : content

    const containsPrefix = messageContent.indexOf(this.client.prefix) === 0

    // If we are not being messaged and the prefix is not present (or bypassed via config flag), ignore message,
    // so if msg does not contain prefix and either of
    //   1. optional flag is not true or 2. bot has not been DMed or mentioned,
    // then skip the message.
    if (
      !containsPrefix &&
      (!prefixOptionalWhenMentionOrDM || (!isMention && !isDM))
    )
      return

    setTimeout(() => {
      channel.sendTyping()
    }, message.content.length)

    console.log('discord spell_handler:', this.spell_handler)
    const response = await handleInput(
      message.content,
      message.author.username,
      this.discord_bot_name,
      'discord',
      message.channel.id,
      this.entity,
      this.spell_handler,
      this.spell_version
    )
    this.handlePingSoloAgent(message.channel.id, message.id, response, false)
  }

  //Event that is triggered when a message is deleted
  messageDelete = async (client, message) => {
    const { author, channel, id } = message
    if (!author) return
    if (!client || !client.user) return
    if (author.id === this.client.user.id) return

    const oldResponse = this.getResponse(channel.id, id)
    if (oldResponse === undefined) return

    await channel.messages
      .fetch({ limit: this.client.edit_messages_max_count })
      .then(async messages => {
        messages.forEach(function (resp) {
          if (resp.id === oldResponse) {
            resp.delete()
          }
        })
      })
      .catch(err => log(err))

    this.onMessageDeleted(channel.id, id)
  }

  //Event that is triggered when a message is updated (changed)
  messageUpdate = async (client, message) => {
    const { author, channel, id } = message
    if (author === null || channel === null || id === null) return
    if (author.id === this.client.user.id) {
      log('same author')
      return
    }

    const oldResponse = this.getResponse(channel.id, id)
    if (oldResponse === undefined) {
      await channel.messages.fetch(id).then(async msg => {})
      log('message not found')
      return
    }

    channel.messages
      .fetch(oldResponse)
      .then(async msg => {
        channel.messages
          .fetch({ limit: this.client.edit_messages_max_count })
          .then(async messages => {
            messages.forEach(async function (edited) {
              if (edited.id === id) {
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

                let parentId = ''
                if (channel.type === channelTypes['thread']) {
                  parentId = channel.prefixOptionalWhenMentionOrDM
                }

                // TODO: Replace message with direct message handler
                log(
                  edited.content,
                  edited.id,
                  'Discord',
                  edited.channel.id,
                  utcStr,
                  false,
                  'parentId:' + parentId
                )
                // MessageClient.instance.sendMessageEdit(edited.content, edited.id, 'Discord', edited.channel.id, utcStr, false, 'parentId:' + parentId)
              }
            })
          })
      })
      .catch(err => log(err + ' - ' + err.stack))
  }

  //Event that is trigger when a user's presence is changed (offline, idle, online)
  presenceUpdate = async (client, oldMember, newMember) => {
    if (!oldMember || !newMember) {
      log('Cannot update presence, oldMember or newMember is null')
    } else if (oldMember.status !== newMember.status) {
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

      this.client.users.fetch(newMember.userId).then(user => {
        if (newMember.status === 'online') {
          //roomManager.instance.addUser(user.id, 'discord')
        } else {
          // roomManager.instance.removeUser(user.id, 'discord')
        }
        // TODO: Replace message with direct message handler
        log('Discord', newMember.status, user.username, utcStr)
        // MessageClient.instance.sendUserUpdateEvent('Discord', newMember.status, user.username, utcStr)
      })
    }
  }

  //Event that is triggered when the discord client fully loaded
  ready = async client => {
    const logDMUserID = false
    await this.client.users
      .fetch(logDMUserID)
      .then(user => {
        this.client.log_user = user
      })
      .catch(error => {
        log(error)
      })

    //rgisters the slash commands to each server
    await this.client.guilds.cache.forEach(server => {
      if (!server.deleted) {
        log('fetching messages from server: ' + server.name)
        this.client.api
          .applications(client.user.id)
          .guilds(server.id)
          .commands.post({
            data: {
              name: 'continue',
              description: 'makes the agent continue',
            },
          })
        this.client.api
          .applications(client.user.id)
          .guilds(server.id)
          .commands.post({
            data: {
              name: 'single_continue',
              description: 'test',
            },
          })
        this.client.api
          .applications(client.user.id)
          .guilds(server.id)
          .commands.post({
            data: {
              name: 'say',
              description: 'makes the agent say something',
              options: [
                {
                  name: 'text',
                  description: 'text',
                  type: 3,
                  required: true,
                },
              ],
            },
          })

        //adds unread message to the chat history from each channel
        server.channels.cache.forEach(async channel => {
          if (
            channel.type === channelTypes['text'] &&
            channel.deleted === false &&
            channel
              .permissionsFor(client.user.id)
              .has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
          ) {
            // TODO: Replace message with direct message handler
            log(channel.name, 'Discord', channel.id, channel.topic || 'none')
            // MessageClient.instance.sendMetadata(channel.name, 'Discord', channel.id, channel.topic || 'none')
            channel.messages.fetch({ limit: 100 }).then(async messages => {
              messages.forEach(async function (msg) {
                let _author = msg.author.username
                if (
                  msg.author.isBot ||
                  msg.author.username.toLowerCase().includes('digital being')
                )
                  _author = this.discord_bot_name

                if (msg.deleted === true) {
                  // await deleteMessageFromHistory(channel.id, msg.id)
                  log('deleted message: ' + msg.content)
                } else await wasHandled(channel.id, msg.id, _author, msg.content, msg.createdTimestamp)
              })
            })
          }
        })
      }
    })

    log('client is ready')
  }

  embedColor = '#000000'
  _commandToValue = ([name, args, description]) =>
    ['.' + name, args.join(' '), '-', description].join(' ')
  _commandToDescription = ([name, args, description]) =>
    '```css\n' +
    ['.' + name, args.join(' '), '-', description].join(' ') +
    '```'
  _commandsToValue = commands =>
    '```css\n' +
    commands.map(command => this._commandToValue(command)).join('\n') +
    '```'

  helpFields = [
    {
      name: 'Tweak',
      shortname: 'tweak',
      commands: [
        [
          'ping',
          ['HandleMessage'],
          ['sender', 'message', 'client_name', 'chat_id'],
          'ping all agents',
        ],
        [
          'slash_command',
          ['HandleSlashCommand'],
          ['sender', 'command', 'args', 'client_name', 'chat_id', 'createdAt'],
          'handle slash command',
        ],
        [
          'user_update',
          ['HandleUserUpdate'],
          ['username', 'event', 'createdAt'],
          'handle user update',
        ],
        [
          'message_reaction',
          ['HandleMessageReaction'],
          [
            'client_name',
            'chat_id',
            'message_id',
            'content',
            'user',
            'reaction',
            'createdAt',
          ],
          'handle message reaction',
        ],
        [
          'pingagent',
          ['InvokeSoloAgent'],
          ['sender', 'message', 'agent', 'createdAt'],
          'ping a single agent',
        ],
        ['agents', ['GetAgents'], [''], 'show all selected agents'],
        [
          'setagent',
          ['SetAgentFields'],
          ['name', 'context'],
          'update agents parameters',
        ],
        ['commands', [''], [''], 'Shows all available commands'],
      ],
      value: '',
    },
  ].map(o => {
    o.value = this._commandsToValue(o.commands)
    return o
  })

  _findCommand = commandName => {
    let command = null
    for (const helpField of helpFields) {
      for (const c of helpField.commands) {
        const [name, args, description] = c
        if (name === commandName) {
          command = c
          break
        }
      }
      if (command !== null) {
        break
      }
    }
    return command
  }

  _parseWords = s => {
    const words = []
    const r = /\S+/g
    let match
    while ((match = r.exec(s))) {
      words.push(match)
    }
    return words
  }

  replacePlaceholders(text) {
    if (text === undefined || text === '') return ''

    if (text.includes('{time_now}')) {
      const now = new Date()
      const time =
        now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      text = text.replace('{time_now}', time)
    }
    if (text.includes('{date_now}')) {
      const today = new Date()
      const date =
        today.getDay() + '/' + today.getMonth() + '/' + today.getFullYear()
      text = text.replace('{date_now}', date)
    }
    if (text.includes('{year_now}')) {
      text = text.replace('{year_now', new Date().getFullYear().toString())
    }
    if (text.includes('{month_now}')) {
      text = text.replace('{month_now}', new Date().getMonth().toString())
    }
    if (text.includes('{day_now}')) {
      text = text.replace('{day_now}', new Date().getDay().toString())
    }
    if (text.includes('{name}')) {
      text = text.replace('{name}', this.bot_name)
    }

    return text
  }

  async sendSlashCommandResponse(client, interaction, chat_id, text) {
    this.client.api
      .interactions(interaction.id, interaction.token)
      .callback.post({
        data: {
          type: 4,
          data: {
            content: text,
          },
        },
      })
      .catch(console.error)
  }

  async handleSlashCommand(client, interaction) {
    const command = interaction.data.name.toLowerCase()
    const sender = interaction.member.user.username + ''
    const chatId = interaction.channel_id + ''

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
    // TODO: Replace message with direct message handler
    log(
      sender,
      command,
      command === 'say' ? interaction.data.options[0].value : 'none',
      'Discord',
      chatId,
      utcStr
    )
    // MessageClient.instance.sendSlashCommand(sender, command, command === 'say' ? interaction.data.options[0].value : 'none', 'Discord', chatId, utcStr)
  }

  async handleSlashCommandResponse(chat_id, response) {
    this.client.channels
      .fetch(chat_id)
      .then(channel => {
        channel.send(response)
        channel.stopTyping()
      })
      .catch(err => log(err))
  }

  async handleUserUpdateEvent(response) {
    log('handleUserUpdateEvent: ' + response)
  }

  async handleGetAgents(chat_id, response) {
    this.client.channels
      .fetch(chat_id)
      .then(channel => {
        channel.send(response)
        channel.stopTyping()
      })
      .catch(err => log(err))
  }

  async handleSetAgentsFields(chat_id, response) {
    this.client.channels
      .fetch(chat_id)
      .then(channel => {
        channel.send(response)
        channel.stopTyping()
      })
      .catch(err => log(err))
  }

  async handlePingSoloAgent(chat_id, message_id, responses, addPing) {
    this.client.channels
      .fetch(chat_id)
      .then(channel => {
        channel.messages.fetch(message_id).then(message => {
          log('response:', responses)
          if (
            responses !== undefined &&
            responses.length <= 2000 &&
            responses.length > 0
          ) {
            let text = this.replacePlaceholders(responses)
            if (addPing) {
              message
                .reply(text)
                .then(async function (msg) {
                  //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                })
                .catch(console.error)
            } else {
              while (
                text === undefined ||
                text === '' ||
                text.replace(/\s/g, '').length === 0
              )
                text = getRandomEmptyResponse()
              log('response1: ' + text)
              message.channel
                .send(text)
                .then(async function (msg) {
                  //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                })
                .catch(console.error)
            }
          } else if (
            responses &&
            responses !== undefined &&
            responses.length >= 2000
          ) {
            let text = this.replacePlaceholders(responses)
            if (addPing) {
              message.reply(text).then(async function (msg) {
                //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
              })
            } else {
              while (
                text === undefined ||
                text === '' ||
                text.replace(/\s/g, '').length === 0
              )
                text = getRandomEmptyResponse()
              log('response2: ' + text)
            }
            if (text.length > 0) {
              message.channel
                .send(text, { split: true })
                .then(async function (msg) {
                  //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                })
            }
          } else {
            const emptyResponse = getRandomEmptyResponse()
            log('sending empty response 1: ' + emptyResponse)
            if (
              emptyResponse !== undefined &&
              emptyResponse !== '' &&
              emptyResponse.replace(/\s/g, '').length !== 0
            ) {
              let text = emptyResponse
              if (addPing) {
                message
                  .reply(text)
                  .then(async function (msg) {
                    //this.onMessageResponseUpdated(
                    //  channel.id,
                    //  message.id,
                    //  msg.id
                    //)
                  })
                  .catch(console.error)
              } else {
                while (
                  text === undefined ||
                  text === '' ||
                  text.replace(/\s/g, '').length === 0
                )
                  text = getRandomEmptyResponse()
                log('response4: ' + text)
                message.channel
                  .send(text)
                  .then(async function (msg) {
                    //this.onMessageResponseUpdated(
                    //  channel.id,
                    //  message.id,
                    //  msg.id
                    //)
                  })
                  .catch(console.error)
              }
            }
          }
        })
      })
      .catch(err => log(err))
  }

  async handleMessageEdit(message_id, chat_id, responses, addPing) {
    this.client.channels.fetch(chat_id).then(async channel => {
      const oldResponse = getResponse(channel.id, message_id)
      if (oldResponse === undefined) {
        return
      }

      channel.messages.fetch(oldResponse).then(async msg => {
        channel.messages
          .fetch({ limit: this.client.edit_messages_max_count })
          .then(async messages => {
            messages.forEach(async function (edited) {
              if (edited.id === message_id) {
                Object.keys(responses).map(async function (key, index) {
                  log('response: ' + responses)
                  log('response: ' + key)
                  log('response: ' + index)

                  if (
                    responses !== undefined &&
                    responses.length <= 2000 &&
                    responses.length > 0
                  ) {
                    let text = replacePlaceholders(responses)
                    while (
                      text === undefined ||
                      text === '' ||
                      text.replace(/\s/g, '').length === 0
                    )
                      text = getRandomEmptyResponse()
                    log('response1: ' + text)
                    msg.edit(text)
                    onMessageResponseUpdated(channel.id, edited.id, msg.id)
                  } else if (responses.length >= 2000) {
                    let text = replacePlaceholders(responses)
                    while (
                      text === undefined ||
                      text === '' ||
                      text.replace(/\s/g, '').length === 0
                    )
                      text = getRandomEmptyResponse()
                    log('response2: ' + text)

                    if (text.length > 0) {
                      edited.channel
                        .send(text, { split: true })
                        .then(async function (msg) {
                          onMessageResponseUpdated(
                            channel.id,
                            edited.id,
                            msg.id
                          )
                        })
                    }
                  } else {
                    const emptyResponse = getRandomEmptyResponse()
                    log('sending empty response 2: ' + emptyResponse)
                    if (
                      emptyResponse !== undefined &&
                      emptyResponse !== '' &&
                      emptyResponse.replace(/\s/g, '').length !== 0
                    ) {
                      let text = emptyResponse
                      while (
                        text === undefined ||
                        text === '' ||
                        text.replace(/\s/g, '').length === 0
                      )
                        text = getRandomEmptyResponse()
                      log('response4: ' + text)
                      msg.edit(text)
                      onMessageResponseUpdated(channel.id, edited.id, msg.id)
                    }
                  }
                })
                edited.channel.stopTyping()
              }
            })
          })
          .catch(err => log(err))
      })
    })
  }

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
      //   roomManager.instance.removeUser(user, 'discord')
    }
  }

  getResponse(channel, message) {
    if (this.messageResponses[channel] === undefined) return undefined
    return this.messageResponses[channel][message]
  }

  async wasHandled(chatId, messageId, sender, content, timestamp) {
    if (!database || !database.instance) return // log("Postgres not inited");
    return await database.instance.messageExists(
      'discord',
      chatId,
      messageId,
      sender,
      content,
      timestamp
    )
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

  client = Discord.Client
  messageEvent = undefined
  agent = undefined
  discord_starting_words: string[] = []
  discord_bot_name_regex: string = ''
  discord_bot_name: string = 'Bot'

  createDiscordClient = async (
    agent,
    discord_api_token,
    discord_starting_words,
    discord_bot_name_regex,
    discord_bot_name,
    entity,
    spell_handler,
    spell_version = 'latest'
  ) => {
    this.agent = agent
    this.entity = entity
    if (!discord_starting_words || discord_starting_words?.length <= 0) {
      this.discord_starting_words = ['hi', 'hey']
    } else {
      this.discord_starting_words = discord_starting_words?.split(',')
      for (let i = 0; i < this.discord_starting_words.length; i++) {
        this.discord_starting_words[i] = this.discord_starting_words[i]
          .trim()
          .toLowerCase()
      }
    }
    this.discord_bot_name_regex = discord_bot_name_regex
    this.discord_bot_name = discord_bot_name
    this.spell_handler = spell_handler
    this.spell_version = spell_version

    const token = discord_api_token ?? process.env.DISCORD_API_TOKEN
    if (!token) return console.warn('No API token for Discord bot, skipping')

    this.client = new Discord.Client({
      partials: ['MESSAGE', 'USER', 'REACTION'],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    })
    this.bot_name = discord_bot_name
    this.client.prefix = '!'
    this.client.prefixOptionalWhenMentionOrDM = true

    //{ intents: [ Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_VOICE_STATES, Intents.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
    // We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
    this.client.helpFields = this.helpFields
    this.client._findCommand = this._findCommand
    this.client._parseWords = this._parseWords
    this.client.name_regex = new RegExp(discord_bot_name, 'ig')

    this.client.username_regex = new RegExp(this.discord_bot_name_regex, 'ig') //'((?:digital|being)(?: |$))'
    this.client.edit_messages_max_count = 5

    const embed = new Discord.MessageEmbed().setColor(0x00ae86)

    this.client.embed = embed

    this.client.on('messageCreate', this.messageCreate.bind(null, this.client))
    this.client.on('messageDelete', this.messageDelete.bind(null, this.client))
    this.client.on('messageUpdate', this.messageUpdate.bind(null, this.client))
    this.client.on(
      'presenceUpdate',
      this.presenceUpdate.bind(null, this.client)
    )

    this.messageEvent = new EventEmitter()
    this.messageEvent.on(
      'new_message',
      async function (ds, response, addPing, channel, message) {
        const responseMessage = response.message
        log('response: ' + JSON.stringify(responseMessage))
        if (
          responseMessage !== undefined &&
          responseMessage.length <= 2000 &&
          responseMessage.length > 0
        ) {
          let text = ds.replacePlaceholders(responseMessage)
          if (addPing) {
            message
              .reply(text)
              .then(async function (msg) {
                ds.onMessageResponseUpdated(channel.id, message.id, msg.id)
              })
              .catch(console.error)
          } else {
            while (
              text === undefined ||
              text === '' ||
              text.replace(/\s/g, '').length === 0
            )
              text = getRandomEmptyResponse()
            log('response1: ' + text)
            message.channel
              .send(text)
              .then(async function (msg) {
                ds.onMessageResponseUpdated(channel.id, message.id, msg.id)
              })
              .catch(console.error)
          }
        } else if (responseMessage && responseMessage.length >= 2000) {
          let text = replacePlaceholders(responseMessage)
          if (addPing) {
            message.reply(text).then(async function (msg) {
              ds.onMessageResponseUpdated(channel.id, message.id, msg.id)
            })
          } else {
            while (
              text === undefined ||
              text === '' ||
              text.replace(/\s/g, '').length === 0
            )
              text = getRandomEmptyResponse()
            log('response2: ' + text)
          }
          if (text.length > 0) {
            message.channel
              .send(text, { split: true })
              .then(async function (msg) {
                ds.onMessageResponseUpdated(channel.id, message.id, msg.id)
              })
          }
        } else {
          const emptyResponse = getRandomEmptyResponse()
          log('sending empty response 3: ' + emptyResponse)
          if (
            emptyResponse !== undefined &&
            emptyResponse !== '' &&
            emptyResponse.replace(/\s/g, '').length !== 0
          ) {
            let text = emptyResponse
            if (addPing) {
              message
                .reply(text)
                .then(async function (msg) {
                  ds.onMessageResponseUpdated(channel.id, message.id, msg.id)
                })
                .catch(console.error)
            } else {
              while (
                text === undefined ||
                text === '' ||
                text.replace(/\s/g, '').length === 0
              )
                text = getRandomEmptyResponse()
              log('response4: ' + text)
              message.channel
                .send(text)
                .then(async function (msg) {
                  ds.onMessageResponseUpdated(channel.id, message.id, msg.id)
                })
                .catch(console.error)
            }
          }
        }
      }
    )

    this.client.on('interactionCreate', async interaction => {
      log('Handling interaction', interaction)
      this.handleSlashCommand(client, interaction)
    })
    this.client.on('guildMemberAdd', async user => {
      this.handleGuildMemberAdd(user)
    })
    this.client.on('guildMemberRemove', async user => {
      this.handleGuildMemberRemove(user)
    })
    this.client.on('messageReactionAdd', async (reaction, user) => {
      this.handleMessageReactionAdd(reaction, user)
    })

    this.client.commands = new Discord.Collection()

    this.client.commands.set('agents', this.agents)
    this.client.commands.set('ban', this.ban)
    this.client.commands.set('commands', this.commands)
    this.client.commands.set('ping', this.ping)
    this.client.commands.set('pingagent', this.pingagent)
    this.client.commands.set('setagent', this.setagent)
    this.client.commands.set('setname', this.setname)
    this.client.commands.set('unban', this.unban)

    setInterval(() => {
      const channelIds = []

      this.client.channels.cache.forEach(async channel => {
        if (!channel || !channel.topic) return
        if (channel === undefined || channel.topic === undefined) return
        if (
          channel.topic.length < 0 ||
          channel.topic.toLowerCase() !== 'daily discussion'
        )
          return
        if (channelIds.includes(channel.id)) return

        channelIds.push(channel.id)
        if (
          this.discussionChannels[channel.id] === undefined ||
          !this.discussionChannels
        ) {
          this.discussionChannels[channel.id] = {
            timeout: setTimeout(() => {
              delete this.discussionChannels[channel.id]
            }, 1000 * 3600 * 4),
            responded: false,
          }
          // const resp = await handleInput(
          //   'Tell me about ' + 'butterlifes',
          //   'bot',
          //    this.discord_bot_name ?? 'Agent',
          //   'discord',
          //   message.channel.id,
          //   this.spell_handler,
          //   this.spell_version
          // )
          // channel.send(resp)
        }
      })
    }, 1000 * 3600)

    this.client.login(token)
  }

  discussionChannels = {}

  async sendMessageToChannel(channelId, msg) {
    const channel = await this.client.channels.fetch(channelId)
    if (channel && channel !== undefined) {
      channel.send(msg)
    }
  }
}

export default discord_client
