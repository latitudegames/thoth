/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { IgApiClient } from 'instagram-private-api'
import { database } from './database'
import { handleInput } from './handleInput'
import { getSetting } from './utils'

export class instagram_client {
  agent
  spell_handler
  spell_version

  createInstagramClient = async (
    agent,
    username,
    password,
    spell_version,
    spell_handler
  ) => {
    this.agent = agent
    this.spell_version = spell_version
    this.spell_handler = spell_handler

    const username = getSetting(settings, 'instagramUsername')
    const password = getSetting(settings, 'instagramPassword')
    if (!username || !password)
      return console.warn('No Instagram credentials found, skipping')

    //creates the instagram client and logs in using the credentials
    const ig = new IgApiClient()
    ig.state.generateDevice(username)

    await ig.simulate.preLoginFlow()
    const loggedInUser = await ig.account.login(username, password)
    process.nextTick(async () => await ig.simulate.postLoginFlow())

    const history = {
      pending: await ig.feed.directInbox().items(),
      unread: [],
    }

    for (const idx in history.pending) {
      const pending = history.pending[idx]
      if (pending.last_permanent_item.item_type === 'text') {
        await database.instance.messageExists(
          'instagram',
          pending.thread_id,
          pending.last_permanent_item.item_id + '',
          pending.last_permanent_item.user_id === loggedInUser.pk
            ? agent.name
            : pending.thread_title,
          pending.last_permanent_item.text,
          parseInt(pending.last_permanent_item.timestamp) / 1000
        )
      }
    }

    setInterval(async () => {
      const inbox = {
        pending: await ig.feed.directInbox().items(),
      }

      for (const idx in inbox.pending) {
        const pending = inbox.pending[idx]
        if (pending.last_permanent_item.item_type === 'text') {
          if (pending.last_permanent_item.user_id === loggedInUser.pk) {
            await database.instance.messageExists(
              'instagram',
              pending.thread_id,
              pending.last_permanent_item.item_id + '',
              pending.last_permanent_item.user_id === loggedInUser.pk
                ? agent.name
                : pending.thread_title,
              pending.last_permanent_item.text,
              parseInt(pending.last_permanent_item.timestamp) / 1000
            )

            continue
          }

          await database.instance.messageExistsAsyncWitHCallback(
            'instgram',
            pending.thread_id,
            pending.last_permanent_item.item_id + '',
            pending.users[0].username,
            pending.last_permanent_item.text,
            parseInt(pending.last_permanent_item.timestamp),
            async () => {
              const timestamp = parseInt(pending.last_permanent_item.timestamp)
              const date = new Date(timestamp / 1000)
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

              log('got new message: ' + pending.last_permanent_item.text)

              const resp = await handleInput(
                pending.last_permanent_item.text,
                pending.users[0].username,
                agent.name,
                'instagram',
                pending.thread_id,
                this.spell_handler,
                this.spell_version
              )

              const thread = ig.entity.directThread(chatId)
              await thread.broadcastText(resp)

              database.instance.addMessageInHistoryWithDate(
                'instagram',
                pending.thread_id,
                pending.last_permanent_item.item_id + '',
                pending.users[0].username,
                pending.last_permanent_item.text,
                utcStr
              )
            }
          )
        }
      }
    }, 5000)
  }
}
