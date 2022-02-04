import { Autohook } from 'twitter-autohook';
import http from 'http';
import url from 'url';
import { handleInput } from "./handleInput.js";
import TwitterClient from 'twit';
import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'


let TwitClient;

const SendMessage = (id, twitterUserId, messageType, text) => {
  if (messageType === 'DM') {
    TwitClient.post('direct_messages/events/new', {
      "event": {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": id
          },
          "message_data": {
            "text": text,
          }
        }
      }
    }, (error, data, response) => { if (error) console.error(error) });
  } else {
    TwitClient.post('statuses/update', { status: '@' + twitterUserId + ' ' + text, id, in_reply_to_status_id: id }, function (err, data, response) {
      //console.log("Posted ", '@' + twitterUserId + ' ' + text)
    })
  }
}

const HandleResponse = async (id, name, receivedMessage, messageType, event) => {
  let reply = await handleInput(receivedMessage, name, customConfig.instance.get('botName'), null, 'twitter', id);

  // if prompt is more than 280 characters, remove the last sentence
  while (reply.length > 280) {
    reply = reply.substring(0, reply.lastIndexOf(".")) + ".";
  }

  TwitClient.post('statuses/update', { status: reply }, function (err, data, response) {
    if (err) console.error(err);
  })


  SendMessage(id, name, messageType, reply);
}

const validateWebhook = (token, auth) => {
  const responseToken = crypto.createHmac('sha256', auth).update(token).digest('base64');
  return { response_token: `sha256=${responseToken}` };
}

export const createTwitterClient = async (twitterId = customConfig.instance.get('twitterId')) => {
  TwitClient = new TwitterClient({
    consumer_key: customConfig.instance.get('twitterConsumerKey'),
    consumer_secret: customConfig.instance.get('twitterConsumerSecret'),
    access_token: customConfig.instance.get('twitterAccessToken'),
    access_token_secret: customConfig.instance.get('twitterAccessTokenSecret'),
  });

  const webhook = new Autohook({
    token: customConfig.instance.get('twitterWebhookToken'),
    token_secret: customConfig.instance.get('twtterAccessTokenSecret'),
    consumer_key: customConfig.instance.get('twitterConsumerKey'),
    consumer_secret: customConfig.instance.get('twitterConsumerSecret'),
    ngrok_secret: customConfig.instance.get('ngrokToken'),
    env: 'dev',
    port: customConfig.instance.get('twitterWebhookPort'),
  });
  await webhook.removeWebhooks();
  webhook.on('event', event => {
    if (typeof (event.tweet_create_events) !== 'undefined' &&
      event.tweet_create_events[0].user.screen_name !== twitterId) {
      const id = event.tweet_create_events[0].user.id
      const screenName = event.tweet_create_events[0].user.screen_name
      const ReceivedMessage = event.tweet_create_events[0].text;
      const message = ReceivedMessage.replace("@" + twitterId + " ", "")
      if (!screenName.toLowerCase().includes(twitterId.toLowerCase())) {
        HandleResponse(id, screenName, message, 'Tweet', event);
      }
    }

    if (typeof (event.direct_message_events) !== 'undefined') {
      if (event.users[event.direct_message_events[0].message_create.sender_id].screen_name !== twitterId) {
        const id = event.direct_message_events[0].message_create.sender_id;
        const name = event.users[event.direct_message_events[0].message_create.sender_id].screen_name;
        const ReceivedMessage = event.direct_message_events[0].message_create.message_data.text;
        HandleResponse(id, name, ReceivedMessage, 'DM', event)
      }
    }
  });
  await webhook.start();
  await webhook.subscribe({
    oauth_token: customConfig.instance.get('twitterAccessToken'),
    oauth_token_secret: customConfig.instance.get('twitterAccessTokenSecret'),
    screen_name: customConfig.instance.get('twitterID')
  });

  // handle this
  http.createServer((req, res) => {
    const route = url.parse(req.url, true);

    if (!route.pathname) {
      return;
    }

    if (route.query.crc_token) {
      const crc = validateWebhook(route.query.crc_token, customConfig.instance.get('twitterConsumerSecret'));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(crc));
    }
  }).listen(customConfig.instance.get('twitterWebhookPort'));


  setInterval(async () => {
    let prompt = "Could you please write a short, optimistic tweet on web 3.0 culture, the metaverse, internet technology or the state of the world? Must be in less than three sentences.\n" + customConfig.instance.get('botName') + ":";

    let reply = await handleInput(prompt, "Friend", customConfig.instance.get('botName'), null, false, 'twitter', 'prompt');

    // if prompt is more than 280 characters, remove the last sentence
    while (reply.length > 280) {
      reply = reply.substring(0, reply.lastIndexOf(".")) + ".";
    }
    TwitClient.post('statuses/update', { status: reply }, function (err, data, response) {
      if (err) console.error(err);
    })

  }, (1000 * 60 * 60));

}

createTwitterClient();
