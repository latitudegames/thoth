// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// required for message.lineReply
import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import Discord, { Intents } from 'discord.js'
import emoji from 'emoji-dictionary'
import emojiRegex from 'emoji-regex'
import { EventEmitter } from 'events'

import roomManager from '../components/roomManager'
import { database } from '../superreality/database'
import { classifyText } from '../components/textClassifier'
import {
  getRandomEmptyResponse,
  getRandomTopic,
  startsWithCapital,
} from '../superreality/utils'
import { handleInput } from './handleInput'

// TODO: Remove this
const config = {
  prefix: '!',
  prefixOptionalWhenMentionOrDM: true,
  bot_name: 'Cat',
}

//Event that is triggered when a new user is added to the server
export function handleGuildMemberAdd(user: any) {
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
  // MessageClient.instance.sendUserUpdateEvent('Discord', 'join', username, utcStr)
}

//Event that is triggered when a user is removed from the server
export async function handleGuildMemberRemove(user: {
  user: { id: any; username: any }
}) {
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
  // MessageClient.instance.sendUserUpdateEvent('Discord', 'leave', username, utcStr)
}

//Event that is triggered when a user reacts to a message
export async function handleMessageReactionAdd(
  reaction: { emoji?: any; message?: any },
  user: any
) {
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
  // MessageClient.instance.sendMessageReactionAdd('Discord', message.channel.id, message.id, message.content, user.username, emojiName, utcStr)
}

export async function agents(
  client: any,
  message: any,
  args: any,
  author: any,
  addPing: any,
  channel: any
) {
  // TODO: Replace me with direct message handler
  // MessageClient.instance.sendGetAgents('Discord', message.channel.id)
}

//returns all the current commands for the bot
export async function commands(
  client: { helpFields: { commands: any[] }[]; embed: { description: string } },
  message: {
    channel: { send: (arg0: string) => void; stopTyping: () => void }
  },
  args: any,
  author: any,
  addPing: any,
  channel: any
) {
  let str = ''
  client.helpFields[0].commands.forEach(function (item: string[], index: any) {
    if (item[3].length <= 2000 && item[3].length > 0) {
      str += '!' + item[0] + ' - ' + item[3] + '\n'
    }
  })
  if (str.length === 0) client.embed.description = 'empty response'
  message.channel.send(str)
  message.channel.stopTyping()
}

//ping is used to send a message directly to the agent
export async function ping(
  client: { embed: { description: string; desscription: string } },
  message: { channel: { send: (arg0: any) => void; stopTyping: () => void } },
  args: { grpc_args: { [x: string]: string; message: string | undefined } },
  author: any,
  addPing: any,
  channel: any
) {
  if (
    args.grpc_args.message === undefined ||
    args.grpc_args.message === '' ||
    args.grpc_args.message.replace(/\s/g, '').length === 0
  ) {
    client.embed.description = 'Wrong format, !ping message'
    message.channel.send(client.embed)
    client.embed.desscription = ''
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
}

//ping agent is used to ping a specific agent directly
export async function pingagent(
  client: { embed: { description: string; desscription: string } },
  message: { channel: { send: (arg0: any) => void; stopTyping: () => void } },
  args: {
    grpc_args: { message: string | undefined; agent: string | undefined }
  },
  author: any,
  addPing: any,
  channel: any
) {
  if (
    args.grpc_args.message === undefined ||
    args.grpc_args.message === '' ||
    args.grpc_args.message.replace(/\s/g, '').length === 0 ||
    args.grpc_args.message.includes('agent=') ||
    args.grpc_args.agent === undefined ||
    args.grpc_args.agent === '' ||
    args.grpc_args.agent.replace(/\s/g, '').length === 0
  ) {
    client.embed.description =
      'Wrong format, !pingagent agent=agent message=value'
    message.channel.send(client.embed)
    client.embed.desscription = ''
    message.channel.stopTyping()
    return
  }

  // TODO: Replace me with direct message handler
  // MessageClient.instance.sendPingSoloAgent('Discord', message.channel.id, message.id, args.grpc_args['message'], args.grpc_args['agent'], addPing, author.username)
}

//setagent is used to update an agent
export async function setagent(
  client: { embed: { description: string; desscription: string } },
  message: { channel: { send: (arg0: any) => void; stopTyping: () => void } },
  args: { grpc_args: { [x: string]: string; message: string | undefined } },
  author: any,
  addPing: any,
  channel: any
) {
  if (args.grpc_args.message === undefined || args.grpc_args.message === '') {
    client.embed.description =
      'Wrong format, !setagent agent=agent context=value'
    message.channel.send(client.embed)
    client.embed.desscription = ''
    message.channel.stopTyping()
    return
  }
  if (
    args.grpc_args['name'] === undefined ||
    args.grpc_args['name'] === '' ||
    args.grpc_args['context'] === undefined ||
    args.grpc_args['context'] === ''
  ) {
    client.embed.description =
      'Wrong format, !setagent agent=agent context=value'
    message.channel.send(client.embed)
    client.embed.desscription = ''
    message.channel.stopTyping()
    return
  }

  // TODO: Replace me with direct message handler
  // MessageClient.instance.sendSetAgentsFields('Discord', message.channel.id, args.grpc_args['name'], args.grpc_args['context'])
}

//sets the name for an agent to respond for it
export async function setname(
  client: { bot_name: any; name_regex: RegExp },
  message: {
    channel: { send: (arg0: string) => void; stopTyping: () => void }
  },
  args: { parsed_words: string | any[] | undefined },
  author: any,
  addPing: any,
  channel: any
) {
  if (args.parsed_words === undefined || args.parsed_words.length !== 1) {
    message.channel.send('Invalid format, !setname name')
    message.channel.stopTyping()
    return
  }

  const name = args.parsed_words[0]
  client.bot_name = name
  client.name_regex = new RegExp(name, 'ig')
  config.bot_name = name
  message.channel.send('Updated bot name to: ' + name)
  message.channel.stopTyping()
}

export const channelTypes = {
  text: 'GUILD_TEXT',
  dm: 'DM',
  voice: 'GUILD_VOICE',
  thread: 'GUILD_PUBLIC_THREAD',
}

//Event that is trigger when a new message is created (sent)
export const messageCreate = async (
  client: {
    users: { cache: any[] }
    user: { id: any }
    bot_name: string
    username_regex: any
    name_regex: any
    config: { prefixOptionalWhenMentionOrDM: any; prefix: any }
  },
  message: {
    content: any
    guild?: any
    author: any
    id: any
    channel?: any
    mentions?: any
  }
) => {
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
          const user = await client.users.cache.find(
            (user: { id: any }) => user.id == x
          )
          if (user !== undefined) {
            //const u = '@' + user.username + '#' + user.discriminator
            const u =
              user.id == client.user
                ? customConfig.instance.get('botName')
                : user.username
            content = content.replace(data[i], u)
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  //if the message is empty it is ignored
  if (content === '') return
  let _prev = undefined

  //if the author is not a bot, it adds the message to the conversation simulation
  if (!author.bot) {
    _prev = prevMessage[channel.id]
    prevMessage[channel.id] = author
    if (prevMessageTimers[channel.id] !== undefined)
      clearTimeout(prevMessageTimers[channel.id])
    prevMessageTimers[channel.id] = setTimeout(
      () => (prevMessage[channel.id] = ''),
      120000
    )
  }
  //if there are many users in the conversation simulation or the previous message is from someone else, it adds a ping
  const addPing =
    (_prev !== undefined && _prev !== '' && _prev !== author) ||
    moreThanOneInConversation()
  // Ignore all bots
  if (author.bot) return
  addMessageToHistory(channel.id, id, author.username, content)

  //checks if the message contains a direct mention to the bot, or if it is a DM, or if it mentions someone else
  const botMention = `<@!${client.user}>`
  const isDM = channel.type === channelTypes['dm']
  const isMention =
    (channel.type === channelTypes['text'] && mentions.has(client.user)) || isDM
  const otherMention =
    !isMention && mentions.members !== null && mentions.members.size > 0
  let startConv = false
  let startConvName = ''
  //if it isn't a mention to the bot or another mention or a DM
  //it works with the word hi and the next word should either not exist or start with a lower letter to start the conversation
  if (!isMention && !isDM && !otherMention) {
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
  //if it is a mention to another user, then the conversation with the bot is ended
  if (otherMention) {
    exitConversation(author.id)
    mentions.members.forEach((pinged: { id: any }) =>
      exitConversation(pinged.id)
    )
  }
  if (!startConv && !isMention) {
    if (startConvName.length > 0) {
      exitConversation(author.id)
      exitConversation(startConvName)
    }
  }
  //checks if the user is in discussion with the but, or includes !ping or started the conversation, if so it adds (if not exists) !ping in the start to handle the message the ping command
  const isDirectMethion =
    !content.startsWith('!') &&
    content.toLowerCase().includes(client.bot_name.toLowerCase())
  const isUserNameMention =
    (channel.type === channelTypes['text'] || isDM) &&
    content
      .toLowerCase()
      .replace(',', '')
      .replace('.', '')
      .replace('?', '')
      .replace('!', '')
      .match(client.username_regex)
  const isInDiscussion = isInConversation(author.id)
  if (!content.startsWith('!') && !otherMention) {
    if (isMention) content = '!ping ' + content.replace(botMention, '').trim()
    else if (isDirectMethion)
      content = '!ping ' + content.replace(client.name_regex, '').trim()
    else if (isUserNameMention) {
      content = '!ping ' + content.replace(client.username_regex, '').trim()
    } else if (isInDiscussion || startConv) content = '!ping ' + content
  }

  if (otherMention) {
    roomManager.instance.userPingedSomeoneElse(author.id, 'discord')
  } else if (content.startsWith('!ping')) {
    roomManager.instance.userGotInConversationFromAgent(author.id), 'discord'
  } else if (!content.startsWith('!ping')) {
    if (
      discussionChannels[channel.id] !== undefined &&
      discussionChannels[channel.id]
    ) {
      if (!discussionChannels[channel.id].responded) {
        discussionChannels[channel.id].responded = true
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
          if (context == ncontext) {
            roomManager.instance.userTalkedSameTopic(author.id, 'discord')
            if (roomManager.instance.agentCanResponse(author.id, 'discord')) {
              content = '!ping ' + content
            }
          }
        }
      }
    }
  }

  //if the message contains join word, it makes the bot to try to join a voice channel and listen to the users
  if (content.startsWith('!ping')) {
    sentMessage(author.id)
    const mention = `<@!${client.user.id}>`
    if (
      content.startsWith('!ping join') ||
      content.startsWith('!ping ' + mention + ' join')
    ) {
      const d = content.split(' ')
      const index = d.indexOf('join') + 1
      if (d.length > index) {
        const channelName = d[index]
        await message.guild.channels.cache.forEach(
          async (channel: {
            type: string
            name: any
            join: () => any
            leave: () => void
          }) => {
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
              userStream.on('data', (chunk: any) => {
                buffer.push(chunk)
                userStream.pipe(writeStream)
              })
              writeStream.on('pipe', log)
              userStream.on('finish', () => {
                channel.leave()
              })
              return false
            }
          }
        )
        return
      }
    }
  }

  // Set flag to true to skip using prefix if mentioning or DMing us
  const prefixOptionalWhenMentionOrDM =
    client.config.prefixOptionalWhenMentionOrDM

  const msgStartsWithMention = content.startsWith(botMention)

  const messageContent =
    isMention && msgStartsWithMention
      ? content.replace(botMention, '').trim()
      : content

  const containsPrefix = messageContent.indexOf(client.config.prefix) === 0

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

  const response = await handleInput(
    message.content,
    message.author.username,
    customConfig.instance.get('agent') ?? 'Agent',
    null,
    'discord',
    channel.id
  )
  messageEvent.emit('new_message', message.id, channel.id, response, addPing)
}

//Event that is triggered when a message is deleted
export const messageDelete = async (
  client: { user: { id: any }; edit_messages_max_count: any },
  message: { author: any; channel: any; id: any }
) => {
  const { author, channel, id } = message
  await deleteMessageFromHistory(channel.id, id)
  if (!author) return
  if (!client || !client.user) return
  if (author.id === client.user.id) return

  const oldResponse = getResponse(channel.id, id)
  if (oldResponse === undefined) return
  await deleteMessageFromHistory(channel.id, oldResponse)

  await channel.messages
    .fetch({ limit: client.edit_messages_max_count })
    .then(async (messages: any[]) => {
      messages.forEach(function (resp: { id: any; delete: () => void }) {
        if (resp.id === oldResponse) {
          resp.delete()
        }
      })
    })
    .catch((err: any) => console.error(err))

  onMessageDeleted(channel.id, id)
}

//Event that is triggered when a message is updated (changed)
export const messageUpdate = async (
  client: { user: { id: any }; edit_messages_max_count: any },
  message: { author: any; channel: any; id: any }
) => {
  const { author, channel, id } = message
  if (author === null || channel === null || id === null) return
  if (author.id === client.user.id) {
    await channel.messages.fetch(id).then(async (msg: { content: any }) => {
      await updateMessage(channel.id, id, msg.content)
    })
    return
  }

  const oldResponse = getResponse(channel.id, id)
  if (oldResponse === undefined) {
    await channel.messages.fetch(id).then(async (msg: { content: any }) => {
      await updateMessage(channel.id, id, msg.content)
    })
    return
  }

  channel.messages
    .fetch(oldResponse)
    .then(async (msg: any) => {
      channel.messages
        .fetch({ limit: client.edit_messages_max_count })
        .then(async (messages: any[]) => {
          messages.forEach(async function (edited: { id: any }) {
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
              // MessageClient.instance.sendMessageEdit(edited.content, edited.id, 'Discord', edited.channel.id, utcStr, false, 'parentId:' + parentId)
            }
          })
        })
    })
    .catch((err: string) => console.error(err + ' - ' + err.stack))
}

//Event that is trigger when a user's presence is changed (offline, idle, online)
export const presenceUpdate = async (
  client: { users: { fetch: (arg0: any) => Promise<any> } },
  oldMember: { status: any },
  newMember: { status: string; userId: any }
) => {
  if (!oldMember || !newMember) {
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

    client.users.fetch(newMember.userId).then((user: { id: any }) => {
      if (newMember.status === 'online') {
        roomManager.instance.addUser(user.id, 'discord')
      } else {
        roomManager.instance.removeUser(user.id, 'discord')
      }
      // TODO: Replace message with direct message handler
      // MessageClient.instance.sendUserUpdateEvent('Discord', newMember.status, user.username, utcStr)
    })
  }
}

//Event that is triggered when the discord client fully loaded
export const ready = async (client: {
  users: { fetch: (arg0: any) => Promise<any> }
  log_user: any
  guilds: { cache: any[] }
  api: {
    applications: (arg0: any) => {
      (): any
      new(): any
      guilds: {
        (arg0: any): {
          (): any
          new(): any
          commands: {
            (): any
            new(): any
            post: {
              (arg0: {
                data:
                | { name: string; description: string }
                | { name: string; description: string }
                | {
                  name: string
                  description: string
                  options: {
                    name: string
                    description: string
                    type: number
                    required: boolean
                  }[]
                }
              }): void
              new(): any
            }
          }
        }
        new(): any
      }
    }
  }
  user: { id: any }
}) => {
  await client.users
    .fetch(customConfig.instance.get('logDMUserID'))
    .then((user: any) => {
      client.log_user = user
    })
    .catch((error: any) => {
      console.error(error)
    })

  //rgisters the slash commands to each server
  await client.guilds.cache.forEach(
    (server: { deleted: any; id: any; channels: { cache: any[] } }) => {
      if (!server.deleted) {
        client.api
          .applications(client.user.id)
          .guilds(server.id)
          .commands.post({
            data: {
              name: 'continue',
              description: 'makes the agent continue',
            },
          })
        client.api
          .applications(client.user.id)
          .guilds(server.id)
          .commands.post({
            data: {
              name: 'single_continue',
              description: 'test',
            },
          })
        client.api
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
        server.channels.cache.forEach(
          async (channel: {
            type: string
            deleted: boolean
            permissionsFor: (arg0: any) => {
              (): any
              new(): any
              has: { (arg0: string[]): any; new(): any }
            }
            messages: { fetch: (arg0: { limit: number }) => Promise<any> }
            id: any
          }) => {
            if (
              channel.type === channelTypes['text'] &&
              channel.deleted === false &&
              channel
                .permissionsFor(client.user.id)
                .has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
            ) {
              // TODO: Replace message with direct message handler
              // MessageClient.instance.sendMetadata(channel.name, 'Discord', channel.id, channel.topic || 'none')
              channel.messages
                .fetch({ limit: 100 })
                .then(async (messages: any[]) => {
                  messages.forEach(async function (msg: {
                    author: { username: string; isBot: any }
                    deleted: boolean
                    id: any
                    content: any
                    createdTimestamp: any
                  }) {
                    let _author = msg.author.username
                    if (
                      msg.author.isBot ||
                      msg.author.username
                        .toLowerCase()
                        .includes('digital being')
                    )
                      _author = customConfig.instance.get('botName')

                    if (msg.deleted === true) {
                      await deleteMessageFromHistory(channel.id, msg.id)
                    } else
                      await wasHandled(
                        channel.id,
                        msg.id,
                        _author,
                        msg.content,
                        msg.createdTimestamp
                      )
                  })
                })
            }
          }
        )
      }
    }
  )
}

export const embedColor = '#000000'
export const _commandToValue = ([name, args, description]) =>
  ['.' + name, args.join(' '), '-', description].join(' ')
export const _commandToDescription = ([name, args, description]) =>
  '```css\n' + ['.' + name, args.join(' '), '-', description].join(' ') + '```'
export const _commandsToValue = (commands: any[]) =>
  '```css\n' +
  commands
    .map((command: [any, any, any]) => _commandToValue(command))
    .join('\n') +
  '```'

export const helpFields = [
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
  o.value = _commandsToValue(o.commands)
  return o
})

export const _findCommand = (commandName: string | string[]) => {
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

export const _parseWords = (s: string) => {
  const words = []
  const r = /\S+/g
  let match
  while ((match = r.exec(s))) {
    words.push(match)
  }
  return words
}

export function replacePlaceholders(_text: string | undefined) {
  if (_text === undefined || _text === '') return ''
  let text = _text
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
    text = text.replace('{name}', client.bot_name)
  }

  return text
}

export async function sendSlashCommandResponse(
  client: {
    api: {
      interactions: (
        arg0: any,
        arg1: any
      ) => {
        (): any
        new(): any
        callback: {
          (): any
          new(): any
          post: {
            (arg0: {
              data: { type: number; data: { content: any } }
            }): Promise<any>
            new(): any
          }
        }
      }
    }
  },
  interaction: { id: any; token: any },
  chat_id: any,
  text: any
) {
  client.api
    .interactions(interaction.id, interaction.token)
    .callback.post({
      data: {
        type: 4,
        data: {
          content: text,
        },
      },
    })
    .then(() => {
      addMessageToHistory(
        chat_id,
        interaction.id,
        customConfig.instance.get('botName'),
        text
      )
    })
    .catch(console.error)
}

export async function handleSlashCommand(
  client: any,
  interaction: {
    data: { name: string }
    member: { user: { username: string } }
    channel_id: string
  }
) {
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
  // MessageClient.instance.sendSlashCommand(sender, command, command === 'say' ? interaction.data.options[0].value : 'none', 'Discord', chatId, utcStr)
}

async function handlePing(
  message_id: any,
  chat_id: any,
  responses: string | any[] | undefined,
  addPing: any
) {
  client.channels
    .fetch(chat_id)
    .then(
      (channel: {
        messages: { fetch: (arg0: any) => Promise<any> }
        id: any
      }) => {
        channel.messages
          .fetch(message_id)
          .then(
            (message: {
              reply: (arg0: string) => Promise<any>
              id: any
              channel: {
                send: (
                  arg0: string,
                  arg1: { split: boolean } | undefined
                ) => Promise<any>
              }
            }) => {
              if (
                responses !== undefined &&
                responses.length <= 2000 &&
                responses.length > 0
              ) {
                let text = replacePlaceholders(responses)
                if (addPing) {
                  message
                    .reply(text)
                    .then(async function (msg: { id: any }) {
                      onMessageResponseUpdated(channel.id, message.id, msg.id)
                      addMessageToHistory(
                        channel.id,
                        msg.id,
                        customConfig.instance.get('botName'),
                        text
                      )
                    })
                    .catch(console.error)
                } else {
                  while (
                    text === undefined ||
                    text === '' ||
                    text.replace(/\s/g, '').length === 0
                  )
                    text = getRandomEmptyResponse()
                  message.channel
                    .send(text)
                    .then(async function (msg: { id: any }) {
                      onMessageResponseUpdated(channel.id, message.id, msg.id)
                      addMessageToHistory(
                        channel.id,
                        msg.id,
                        customConfig.instance.get('botName'),
                        text
                      )
                    })
                    .catch(console.error)
                }
              } else if (responses && responses.length >= 2000) {
                let text = replacePlaceholders(responses)
                if (addPing) {
                  message.reply(text).then(async function (msg: { id: any }) {
                    onMessageResponseUpdated(channel.id, message.id, msg.id)
                    addMessageToHistory(
                      channel.id,
                      msg.id,
                      customConfig.instance.get('botName'),
                      text
                    )
                  })
                } else {
                  while (
                    text === undefined ||
                    text === '' ||
                    text.replace(/\s/g, '').length === 0
                  )
                    text = getRandomEmptyResponse()
                }
                if (text.length > 0) {
                  message.channel
                    .send(text, { split: true })
                    .then(async function (msg: { id: any }) {
                      onMessageResponseUpdated(channel.id, message.id, msg.id)
                      addMessageToHistory(
                        channel.id,
                        msg.id,
                        customConfig.instance.get('botName'),
                        text
                      )
                    })
                }
              } else {
                const emptyResponse = getRandomEmptyResponse()
                if (
                  emptyResponse !== undefined &&
                  emptyResponse !== '' &&
                  emptyResponse.replace(/\s/g, '').length !== 0
                ) {
                  let text = emptyResponse
                  if (addPing) {
                    message
                      .reply(text)
                      .then(async function (msg: { id: any }) {
                        onMessageResponseUpdated(channel.id, message.id, msg.id)
                        addMessageToHistory(
                          channel.id,
                          msg.id,
                          customConfig.instance.get('botName'),
                          text
                        )
                      })
                      .catch(console.error)
                  } else {
                    while (
                      text === undefined ||
                      text === '' ||
                      text.replace(/\s/g, '').length === 0
                    )
                      text = getRandomEmptyResponse()
                    message.channel
                      .send(text)
                      .then(async function (msg: { id: any }) {
                        onMessageResponseUpdated(channel.id, message.id, msg.id)
                        addMessageToHistory(
                          channel.id,
                          msg.id,
                          customConfig.instance.get('botName'),
                          text
                        )
                      })
                      .catch(console.error)
                  }
                }
              }
            }
          )
          .catch((err: any) => console.error(err))
      }
    )
}

export async function handleSlashCommandResponse(chat_id: any, response: any) {
  client.channels
    .fetch(chat_id)
    .then((channel: { send: (arg0: any) => void; stopTyping: () => void }) => {
      channel.send(response)
      channel.stopTyping()
    })
    .catch((err: any) => console.error(err))
}

export async function handleUserUpdateEvent(response: any) { }

export async function handleGetAgents(chat_id: any, response: any) {
  client.channels
    .fetch(chat_id)
    .then((channel: { send: (arg0: any) => void; stopTyping: () => void }) => {
      channel.send(response)
      channel.stopTyping()
    })
    .catch((err: any) => console.error(err))
}

export async function handleSetAgentsFields(chat_id: any, response: any) {
  client.channels
    .fetch(chat_id)
    .then((channel: { send: (arg0: any) => void; stopTyping: () => void }) => {
      channel.send(response)
      channel.stopTyping()
    })
    .catch((err: any) => console.error(err))
}

export async function handlePingSoloAgent(
  chat_id: any,
  message_id: any,
  responses: string | any[] | undefined,
  addPing: any
) {
  client.channels
    .fetch(chat_id)
    .then(
      (channel: {
        messages: { fetch: (arg0: any) => Promise<any> }
        id: any
      }) => {
        channel.messages.fetch(message_id).then(
          (message: {
            reply: (arg0: string) => Promise<any>
            id: any
            channel: {
              send: (
                arg0: string,
                arg1: { split: boolean } | undefined
              ) => Promise<any>
            }
          }) => {
            Object.keys(responses).map(function (key, index) {
              if (
                responses !== undefined &&
                responses.length <= 2000 &&
                responses.length > 0
              ) {
                let text = replacePlaceholders(responses)
                if (addPing) {
                  message
                    .reply(text)
                    .then(async function (msg: { id: any }) {
                      onMessageResponseUpdated(channel.id, message.id, msg.id)
                      addMessageToHistory(
                        channel.id,
                        msg.id,
                        customConfig.instance.get('botName'),
                        text
                      )
                    })
                    .catch(console.error)
                } else {
                  while (
                    text === undefined ||
                    text === '' ||
                    text.replace(/\s/g, '').length === 0
                  )
                    text = getRandomEmptyResponse()
                  message.channel
                    .send(text)
                    .then(async function (msg: { id: any }) {
                      onMessageResponseUpdated(channel.id, message.id, msg.id)
                      addMessageToHistory(
                        channel.id,
                        msg.id,
                        customConfig.instance.get('botName'),
                        text
                      )
                    })
                    .catch(console.error)
                }
              } else if (responses.length >= 2000) {
                let text = replacePlaceholders(responses)
                if (addPing) {
                  message.reply(text).then(async function (msg: { id: any }) {
                    onMessageResponseUpdated(channel.id, message.id, msg.id)
                    addMessageToHistory(
                      channel.id,
                      msg.id,
                      customConfig.instance.get('botName'),
                      text
                    )
                  })
                } else {
                  while (
                    text === undefined ||
                    text === '' ||
                    text.replace(/\s/g, '').length === 0
                  )
                    text = getRandomEmptyResponse()
                }
                if (text.length > 0) {
                  message.channel
                    .send(text, { split: true })
                    .then(async function (msg: { id: any }) {
                      onMessageResponseUpdated(channel.id, message.id, msg.id)
                      addMessageToHistory(
                        channel.id,
                        msg.id,
                        customConfig.instance.get('botName'),
                        text
                      )
                    })
                }
              } else {
                const emptyResponse = getRandomEmptyResponse()
                if (
                  emptyResponse !== undefined &&
                  emptyResponse !== '' &&
                  emptyResponse.replace(/\s/g, '').length !== 0
                ) {
                  let text = emptyResponse
                  if (addPing) {
                    message
                      .reply(text)
                      .then(async function (msg: { id: any }) {
                        onMessageResponseUpdated(channel.id, message.id, msg.id)
                        addMessageToHistory(
                          channel.id,
                          msg.id,
                          customConfig.instance.get('botName'),
                          text
                        )
                      })
                      .catch(console.error)
                  } else {
                    while (
                      text === undefined ||
                      text === '' ||
                      text.replace(/\s/g, '').length === 0
                    )
                      text = getRandomEmptyResponse()
                    message.channel
                      .send(text)
                      .then(async function (msg: { id: any }) {
                        onMessageResponseUpdated(channel.id, message.id, msg.id)
                        addMessageToHistory(
                          channel.id,
                          msg.id,
                          customConfig.instance.get('botName'),
                          text
                        )
                      })
                      .catch(console.error)
                  }
                }
              }
            })
          }
        )
      }
    )
    .catch((err: any) => console.error(err))
}

async function handleMessageEdit(
  message_id: any,
  chat_id: any,
  responses: string | any[] | undefined,
  addPing: any
) {
  client.channels
    .fetch(chat_id)
    .then(
      async (channel: {
        id: any
        messages: { fetch: (arg0: { limit: any }) => Promise<any> }
      }) => {
        const oldResponse = getResponse(channel.id, message_id)
        if (oldResponse === undefined) {
          return
        }

        channel.messages
          .fetch(oldResponse)
          .then(
            async (msg: {
              edit: (arg0: string) => void
              id: any
              content: any
            }) => {
              channel.messages
                .fetch({ limit: client.edit_messages_max_count })
                .then(async (messages: any[]) => {
                  messages.forEach(async function (edited: {
                    id: any
                    author: { send: (arg0: string) => void }
                    content: any
                    channel: {
                      send: (
                        arg0: any,
                        arg1: { split: boolean }
                      ) => Promise<any>
                      stopTyping: () => void
                    }
                  }) {
                    if (edited.id === message_id) {
                      // Warn an offending user about their actions
                      const warn_offender = function (
                        _user: any,
                        ratings: any
                      ) {
                        edited.author.send(
                          `You've got ${ratings} warnings and you will get blocked at 10!`
                        )
                      }

                      await updateMessage(channel.id, edited.id, edited.content)

                      Object.keys(responses).map(async function (key, index) {
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
                          msg.edit(text)
                          onMessageResponseUpdated(
                            channel.id,
                            edited.id,
                            msg.id
                          )
                          await updateMessage(channel.id, msg.id, msg.content)
                        } else if (responses.length >= 2000) {
                          let text = replacePlaceholders(responses)
                          while (
                            text === undefined ||
                            text === '' ||
                            text.replace(/\s/g, '').length === 0
                          )
                            text = getRandomEmptyResponse()
                          if (text.length > 0) {
                            edited.channel
                              .send(text, { split: true })
                              .then(async function (msg: { id: any }) {
                                onMessageResponseUpdated(
                                  channel.id,
                                  edited.id,
                                  msg.id
                                )
                                addMessageToHistory(
                                  channel.id,
                                  msg.id,
                                  customConfig.instance.get('botName'),
                                  text
                                )
                              })
                          }
                        } else {
                          const emptyResponse = getRandomEmptyResponse()
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
                            msg.edit(text)
                            onMessageResponseUpdated(
                              channel.id,
                              edited.id,
                              msg.id
                            )
                            await updateMessage(channel.id, msg.id, msg.content)
                          }
                        }
                      })
                      edited.channel.stopTyping()
                    }
                  })
                })
                .catch((err: any) => console.error(err))
            }
          )
      }
    )
}

export const prevMessage: any = {}
export const prevMessageTimers: any = {}
export const messageResponses: any = {}
export const conversation: any = {}

export function onMessageDeleted(
  channel: string | number,
  messageId: string | number
) {
  if (
    messageResponses[channel] !== undefined &&
    messageResponses[channel][messageId] !== undefined
  ) {
    delete messageResponses[channel][messageId]
  }
}
export function onMessageResponseUpdated(
  channel: string | number,
  messageId: string | number,
  newResponse: any
) {
  if (messageResponses[channel] === undefined) messageResponses[channel] = {}
  messageResponses[channel][messageId] = newResponse
}

export function getMessage(
  channel: { messages: { fetchMessage: (arg0: any) => any } },
  messageId: any
) {
  return channel.messages.fetchMessage(messageId)
}

export function isInConversation(user: string | number) {
  return (
    conversation[user] !== undefined &&
    conversation[user].isInConversation === true
  )
}

export function sentMessage(user: string) {
  for (const c in conversation) {
    if (c === user) continue
    if (
      conversation[c] !== undefined &&
      conversation[c].timeOutFinished === true
    ) {
      exitConversation(c)
    }
  }

  if (conversation[user] === undefined) {
    conversation[user] = {
      timeoutId: undefined,
      timeOutFinished: true,
      isInConversation: true,
    }
    if (conversation[user].timeoutId !== undefined)
      clearTimeout(conversation[user].timeoutId)
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

export function exitConversation(user: string) {
  if (conversation[user] !== undefined) {
    if (conversation[user].timeoutId !== undefined)
      clearTimeout(conversation[user].timeoutId)
    conversation[user].timeoutId = undefined
    conversation[user].timeOutFinished = true
    conversation[user].isInConversation = false
    delete conversation[user]
    roomManager.instance.removeUser(user, 'discord')
  }
}

export function getResponse(
  channel: string | number,
  message: string | number
) {
  if (messageResponses[channel] === undefined) return undefined
  return messageResponses[channel][message]
}

export function addMessageToHistory(
  chatId: any,
  messageId: any,
  senderName: any,
  content: string
) {
  database.instance.addMessageInHistory(
    'discord',
    chatId,
    messageId,
    senderName,
    content
  )
}

export async function addMessageInHistoryWithDate(
  chatId: any,
  messageId: any,
  senderName: any,
  content: any,
  timestamp: any
) {
  await database.instance.addMessageInHistoryWithDate(
    'discord',
    chatId,
    messageId,
    senderName,
    content,
    timestamp
  )
}

export async function deleteMessageFromHistory(chatId: any, messageId: any) {
  await database.instance.deleteMessage('discord', chatId, messageId)
}

export async function updateMessage(
  chatId: any,
  messageId: any,
  newContent: any
) {
  await database.instance.updateMessage(
    'discord',
    chatId,
    messageId,
    newContent,
    true
  )
}

export async function wasHandled(
  chatId: any,
  messageId: any,
  sender: any,
  content: any,
  timestamp: any
) {
  return await database.instance.messageExists(
    'discord',
    chatId,
    messageId,
    sender,
    content,
    timestamp
  )
}

export function moreThanOneInConversation() {
  let count = 0
  for (const c in conversation) {
    if (conversation[c] === undefined) continue
    if (
      conversation[c].isInConversation !== undefined &&
      conversation[c].isInConversation === true &&
      conversation[c].timeOutFinished === false
    )
      count++
  }

  return count > 1
}

export let client: any = undefined
export let messageEvent: any = undefined

export const createDiscordClient = () => {
  let t = null
  try {
    t = customConfig.instance.get('discord_api_token')
  } catch {
    return console.error('no discord token found')
  }
  const token = t != null && t != '' ? t : process.env.DISCORD_API_TOKEN
  if (!token) return console.warn('No API token for Discord bot, skipping')
  console.log('Creating Discord client')
  client = new Discord.Client({
    partials: ['MESSAGE', 'USER', 'REACTION'],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
  })
  //{ intents: [ Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_VOICE_STATES, Intents.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
  // We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
  client.config = config
  client.helpFields = helpFields
  client._findCommand = _findCommand
  client._parseWords = _parseWords
  client.bot_name = config.bot_name
  client.name_regex = new RegExp(config.bot_name, 'ig')
  client.username_regex = new RegExp(
    customConfig.instance.get('botNameRegex'),
    'ig'
  )
  client.edit_messages_max_count = customConfig.instance.getInt(
    'editMessageMaxCount'
  )

  const embed = new Discord.MessageEmbed().setColor(0x00ae86)

  client.embed = embed

  client.on('messageCreate', messageCreate.bind(null, client))
  client.on('messageDelete', messageDelete.bind(null, client))
  client.on('messageUpdate', messageUpdate.bind(null, client))
  client.on('presenceUpdate', presenceUpdate.bind(null, client))

  messageEvent = new EventEmitter()
  messageEvent.on(
    'new_message',
    async function (
      messageId: any,
      channelId: any,
      response: any,
      addPing: any
    ) {
      handlePing(messageId, channelId, response, addPing)
    }
  )

  client.on('interactionCreate', async (interaction: any) => {
    handleSlashCommand(client, interaction)
  })
  client.on('guildMemberAdd', async (user: any) => {
    handleGuildMemberAdd(user)
  })
  client.on('guildMemberRemove', async (user: any) => {
    handleGuildMemberRemove(user)
  })
  client.on('messageReactionAdd', async (reaction: any, user: any) => {
    handleMessageReactionAdd(reaction, user)
  })

  client.commands = new Discord.Collection()

  client.commands.set('agents', agents)
  client.commands.set('commands', commands)
  client.commands.set('ping', ping)
  client.commands.set('pingagent', pingagent)
  client.commands.set('setagent', setagent)
  client.commands.set('setname', setname)

  setInterval(() => {
    const channelIds: any[] = []

    client.channels.cache.forEach(
      async (
        channel:
          | {
            topic: string | undefined
            id: string | number
            send: (arg0: any) => void
          }
          | undefined
      ) => {
        if (!channel || !channel.topic) return
        if (channel === undefined || channel.topic === undefined) return
        if (
          channel.topic.length < 0 ||
          channel.topic.toLowerCase() !== 'daily discussion'
        )
          return
        if (channelIds.includes(channel.id)) return

        console.log('sending to channel with topic: ' + channel.topic)
        channelIds.push(channel.id)
        if (
          discussionChannels[channel.id] === undefined ||
          !discussionChannels
        ) {
          discussionChannels[channel.id] = {
            timeout: setTimeout(() => {
              delete discussionChannels[channel.id]
            }, 1000 * 3600 * 4),
            responded: false,
          }
          const resp = await handleInput(
            'Tell me about ' + getRandomTopic(),
            'bot',
            customConfig.instance.get('agent') ?? 'Agent',
            null,
            'discord',
            channel.id
          )
          channel.send(resp)
        }
      }
    )
  }, 1000 * 3600)

  client.login(token)
}

const discussionChannels = {}

export async function sendMessageToChannel(channelId: any, msg: string) {
  const channel = await client.channels.fetch(channelId)
  if (channel && channel !== undefined) {
    channel.send(msg)
  }
}

export default createDiscordClient
