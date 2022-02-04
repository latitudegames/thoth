// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import { TwitterApi } from 'twitter-api-v2'

import { database } from '../superreality/database'
import { handleInput } from '../superreality/handleInput'

async function handleMessage(
    response,
    chat_id,
    args,
    twitter,
    twitterV1,
    localUser
) {
    if (args === 'DM') {
        const dmSent = await twitterV1.v1.sendDm({
            recipient_id: chat_id,
            text: response,
        })
        database.instance.addMessageInHistory(
            'twitter',
            chat_id,
            dmSent.event.id,
            customConfig.instance.get('botName'),
            response
        )
    } else if (args === 'Twit') {
        await twitterV1.v1.reply(response, chat_id).then(res => {
            database.instance.addMessageInHistory(
                'twitter',
                chat_id,
                res.id_str,
                customConfig.instance.get('botName'),
                response
            )
        })
    }
}

export const createTwitterClient = async () => {
    if (!customConfig.instance)
        return console.error("Can't start twitter client, on config instance set")
    const bearerToken = customConfig.instance.get('twitterBearerToken')
    const twitterUser = customConfig.instance.get('twitterID')
    const twitterAppToken = customConfig.instance.get('twitterAppToken')
    const twitterAppTokenSecret = customConfig.instance.get(
        'twitterAppTokenSecret'
    )
    const twitterAccessToken = customConfig.instance.get('twitterAccessToken')
    const twitterAccessTokenSecret = customConfig.instance.get(
        'twitterAccessTokenSecret'
    )
    const regex = new RegExp('', 'ig')
    const regex2 = new RegExp(customConfig.instance.get('botNameRegex'), 'ig')
    if (!bearerToken || !twitterUser)
        return console.warn('No API token for Whatsapp bot, skipping')

    const twitter = new TwitterApi(bearerToken)
    const twitterV1 = new TwitterApi({
        appKey: twitterAppToken,
        appSecret: twitterAppTokenSecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessTokenSecret,
    })
    const client = twitter.readWrite
    const localUser = await twitter.v2.userByUsername(twitterUser)

    new twitterPacketHandler(
        new TwitterApi(bearerToken),
        new TwitterApi({
            appKey: twitterAppToken,
            appSecret: twitterAppTokenSecret,
            accessToken: twitterAccessToken,
            accessSecret: twitterAccessTokenSecret,
        }),
        localUser
    )

    setInterval(async () => {
        const tv1 = new TwitterApi({
            appKey: twitterAppToken,
            appSecret: twitterAppTokenSecret,
            accessToken: twitterAccessToken,
            accessSecret: twitterAccessTokenSecret,
        })
        const eventsPaginator = await tv1.v1.listDmEvents()
        for await (const event of eventsPaginator) {
            log('Event: ' + JSON.stringify(event.message_create.message_data.text))
            if (event.type == 'message_create') {
                log('isMessage')
                if (event.message_create.sender_id == localUser.data.id) {
                    log('same sender')
                    return
                }

                let authorName = 'unknown'
                const author = await twitter.v2.user(event.message_create.sender_id)
                if (author) authorName = author.data.username

                await database.instance.messageExistsAsyncWitHCallback2(
                    'twitter',
                    event.message_create.target.recipient_id,
                    event.id,
                    authorName,
                    event.message_create.message_data.text,
                    parseInt(event.created_timestamp),
                    async () => {
                        const agent = 'Agent' // (await customConfig.instance.get('agent')) ?? 'Agent'
                        const resp = await handleInput(
                            event.message_create.message_data.text,
                            authorName,
                            agent,
                            null,
                            'twitter',
                            event.id
                        )
                        handleMessage(resp, event.id, 'DM', twitter, tv1, localUser)

                        database.instance.addMessageInHistoryWithDate(
                            'twitter',
                            event.message_create.target.recipient_id,
                            event.id,
                            authorName,
                            event.message_create.message_data.text,
                            event.created_timestamp
                        )
                    }
                )
            }
        }
    }, 25000) /*!twit.data.text.match(regex2)) {

  /*const rules = await client.v2.streamRules()
    if (rules.data?.length) {
        await client.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        })
    }

    const tweetRules = process.env.TWITTER_TWEET_RULES.split(',')
    const _rules = []
    for (let x in tweetRules) {
        log('rule: ' + tweetRules[x])
        _rules.push({value: tweetRules[x]})
    }

    await client.v2.updateStreamRules({
        add: _rules
    })

    const stream = await client.v2.searchStream({
        "tweet.fields": ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id']
    })
    stream.autoReconnect = true

    stream.on(ETwitterStreamEvent.Data, async twit => {
        const isARt = twit.data.referenced_tweets?.some(twit => twit.type === 'retweeted') ?? false
        if (isARt || (localUser !== undefined && twit.data.author_id == localUser.data.id)) {
            log('isArt found')
        } else {
            if (/*!twit.data.text.match(regex) && */
    /*   log('regex doesnt match')
        } else {
        let authorName = 'unknown'
        const author = await twitter.v2.user(twit.data.author_id)
        if (author) authorName = author.data.username
  
        let date = new Date();
        if (twit.data.created_at) date = new Date(twit.data.created_at)
        const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()
        var ts = Math.floor(utc.getTime() / 1000);
  
        await database.instance.messageExistsAsyncWitHCallback2('reddit', twit.data.id, twit.data.id, authorName, twit.data.text, ts, () => {
        MessageClient.instance.sendMessage(twit.data.text,
        twit.data.id,
        'twitter',
        twit.data.in_reply_to_user_id ? twit.data.in_reply_to_user_id : twit.data.id,
        ts + '',
        false,
        authorName,
        'Twit')
        log('sending twit: ' + JSON.stringify(twit))
  
  
  
        database.instance.addMessageInHistoryWithDate(
        'twitter',
        twit.data.id,
        twit.data.id,
        authorName,
        twit.data.text,
        utcStr)
        })
        }
        }
        })*/
}

export default createTwitterClient
