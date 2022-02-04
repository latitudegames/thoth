import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig';
import { database } from "../superreality/database";
import { handleInput } from "../superreality/handleInput.js";
import roomManager from "../superreality/roomManager";
import { classifyText } from "../superreality/textClassifier.js";
import { browserWindow, PageUtils } from './browser.js';
import { detectOsOption, getRandomEmptyResponse, startsWithCapital } from "@latitudegames/thoth-core/src/superreality/utils.js";


export const UsersInRange = {}
export const UsersInHarassmentRange = {}
export const UsersInIntimateRange = {}
export const UsersLookingAt = {}

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

export async function getChatHistory(chatId, length) {
    return await database.instance.getHistory(length, 'xr-engine', chatId)
}
export async function addMessageToHistory(chatId, messageId, senderName, content) {
    await database.instance.addMessageInHistory('xr-engine', chatId, messageId, senderName, content)
}
export async function deleteMessageFromHistory(chatId, messageId) {
    await database.instance.deleteMessage('xr-engine', chatId, messageId)
}
export async function updateMessage(chatId, messageId, newContent) {
    await database.instance.updateMessage('xr-engine', chatId, messageId, newContent, true)
}
export async function wasHandled(chatId, messageId, foundCallback, notFoundCallback) {
    return await database.instance.messageExists2('xr-engine', chatId, messageId, foundCallback, notFoundCallback)
}

export async function saveIfHandled(chatId, messageId, sender, content, timestamp) {
    return await database.instance.messageExists('xr-engine', chatId, messageId, sender, content, timestamp)
}

export function isInRange(user) {
    return UsersInRange[user] !== undefined || UsersInHarassmentRange[user] !== undefined || UsersInIntimateRange[user] !== undefined
}

export async function handleMessages(messages, bot) {
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].text.includes('[') && messages[i].text.includes(']')) continue
        else if (messages[i].text.includes('joined the layer') || messages[i].text.includes('left the layer') || messages[i].text.length === 0) continue
        else if (messages[i].text.includes('in harassment range with')) continue
        else if (messages[i].text.includes('in range with')) continue
        else if (messages[i].text.includes('looking at')) continue
        else if (messages[i].text.includes('in intimate range')) continue
        else if (messages[i].text.startsWith('/') || messages[i].text.startsWith(' /')) continue
        else if (messages[i].senderName === bot.name ||
            (messages[i].sender !== undefined && messages[i].sender.id === bot.userId) ||
            (messages[i].author !== undefined && messages[i].author[1] === bot.userId)) {
            addMessageToHistory(messages[i].channelId, messages[i].id, customConfig.instance.get('botName'), messages[i].text)
            continue
        }
        await wasHandled(messages[i].channelId, messages[i].id, () => {
            return
        }, async () => {
            const date = Date.now() / 1000
            const msgDate = messages[i].updatedAt
            const diff = date - msgDate
            const hours_diff = Math.ceil(diff / 3600)
            const mins_diff = Math.ceil((diff - hours_diff) / 60)
            if (mins_diff > 12 || (mins_diff <= 5 && hours_diff > 1)) {
                const date = new Date(msgDate);
                const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()
                saveIfHandled(messages[i].channelId, messages[i].id, messages[i].senderName !== undefined ? messages[i].senderName : messages[i].sender.name, messages[i].text, utcStr)
                return
            }

            const _sender = messages[i].senderName !== undefined ? messages[i].senderName : messages[i].sender.name
            let content = messages[i].text
            await addMessageToHistory(messages[i].channelId, messages[i].id, _sender, content)
            let addPing = false
            let _prev = undefined
            _prev = prevMessage[messages[i].channelId]
            prevMessage[messages[i].channelId] = _sender
            if (prevMessageTimers[messages[i].channelId] !== undefined) clearTimeout(prevMessageTimers[messages[i].channelId])
            prevMessageTimers[messages[i].channelId] = setTimeout(() => prevMessage[messages[i].channelId] = '', 120000)

            addPing = (_prev !== undefined && _prev !== '' && _prev !== _sender) || moreThanOneInConversation()

            let startConv = false
            let startConvName = ''
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

            if (!startConv) {
                if (startConvName.length > 0) {
                    exitConversation(_sender)
                    exitConversation(startConvName)
                }
            }

            const isUserNameMention = content.toLowerCase().replace(',', '').replace('.', '').replace('?', '').replace('!', '').match(bot.username_regex)
            const isInDiscussion = isInConversation(_sender)
            if (!content.startsWith('!')) {
                if (isUserNameMention) { content = '!ping ' + content.replace(bot.username_regex, '').trim() }
                else if (isInDiscussion || startConv) content = '!ping ' + content
            }

            if (content.startsWith('!ping')) sentMessage(_sender)
            else {
                if (content === '!ping ' || !content.startsWith('!ping')) {
                    if (roomManager.instance.agentCanResponse(user, 'xrengine')) {
                        content = '!ping ' + content;
                        sentMessage(_sender)
                    }
                    else {
                        const oldChat = database.instance.getConversation(bot.username_regex, _sender, 'xrengine', msg.chat.id, false);
                        if (oldChat !== undefined && oldChat.length > 0) {
                            const context = await classifyText(values);
                            const ncontext = await classifyText(content);

                            if (context == ncontext) {
                                roomManager.instance.userTalkedSameTopic(_sender, 'xrengine');
                                if (roomManager.instance.agentCanResponse(_sender, 'xrengine')) {
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
            }

            const dateNow = new Date();
            var utc = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(), dateNow.getUTCHours(), dateNow.getUTCMinutes(), dateNow.getUTCSeconds());
            const utcStr = dateNow.getDate() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()

            const response = await handleInput(content.replace('!ping', ''), _sender, customConfig.instance.get('agent') ?? "Agent", null, 'xr-engine', messages[i].channelId);
            await handleXREngineResponse(response, addPing, _sender)

        })

    }
}


async function handleXREngineResponse(responses, addPing, _sender) {
    if (responses !== undefined && responses.length <= 2000 && responses.length > 0) {
        let text = responses
        while (text === undefined || text === '' || text.replace(/\s/g, '').length === 0) text = getRandomEmptyResponse()
        if (addPing) text = _sender + ' ' + text
        xrengineBot.sendMessage(text)
    }
    else if (responses.length > 2000) {
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
            if (lines[i] !== undefined && lines[i] !== '' && lines[i].replace(/\s/g, '').length !== 0) {
                if (i === 0) {
                    let text = lines[1]
                    while (text === undefined || text === '' || text.replace(/\s/g, '').length === 0) text = getRandomEmptyResponse()
                    if (addPing) {
                        text = _sender + ' ' + text
                        addPing = false
                    }
                    xrengineBot.sendMessage(text)
                }
            }
        }
    }
    else {
        let emptyResponse = getRandomEmptyResponse()
        while (emptyResponse === undefined || emptyResponse === '' || emptyResponse.replace(/\s/g, '').length === 0) emptyResponse = getRandomEmptyResponse()
        if (addPing) emptyResponse = _sender + ' ' + emptyResponse
        xrengineBot.sendMessage(emptyResponse)
    }
}

const doTests = false
let xrengineBot = null;

async function createXREngineClient() {
    if (!customConfig.instance) return console.error("Can't create XREngine client, no custom config instance")
    //generateVoice('hello there', (buf, path) => {}, false)
    xrengineBot = new XREngineBot({ headless: true });

    xrengineBot.delay(Math.random() * 100000);
    await xrengineBot.launchBrowser();
    const XRENGINE_URL = customConfig.instance.get('xrEngineURL') || 'https://localhost:3000/location/test';
    xrengineBot.enterRoom(XRENGINE_URL, { name: "TestBot" })
}

/**
 * Main class for creating a bot.
 */
class XREngineBot {
    activeChannel;
    headless;
    name;
    autoLog;
    fakeMediaPath;
    page;
    browser;
    pu;
    userId
    chatHistory = [];
    avatars = ['Alissa', 'Cornelius', 'James_ReadyPlayerMe', 'Jamie', 'Mogrid', 'Warrior']
    username_regex
    constructor({
        name = "Bot",
        fakeMediaPath = "",
        headless = true,
        autoLog = true } = {}
    ) {
        this.headless = headless;
        this.name = name;
        this.autoLog = autoLog;
        this.fakeMediaPath = fakeMediaPath;
        setInterval(() => this.instanceMessages(), 1000)
    }

    async sendMessage(message) {
        console.log('sending message: ' + message)
        if (message === null || message === undefined) return;

        // TODO:
        // Send message to google cloud speech
        // Get response URL from google cloud speech

        // await this.sendAudio(5)        



        await this.typeMessage('newMessage', message, false);
        await this.pressKey('Enter')

    }

    async sendMovementCommand(x, y, z) {
        if (x === undefined || y === undefined || z == undefined) {
            return
        }

        var _x = parseFloat(x)
        var _y = parseFloat(y)
        var _z = parseFloat(z)
        await this._sendMovementCommand(_x, _y, _z)
    }
    async _sendMovementCommand(x, y, z) {
        if (x === undefined || y === undefined || z === undefined) {
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

        await this.updateChannelState();
        if (!this.activeChannel) return // console.log("No active channel");
        const messages = this.activeChannel.messages;
        if (messages === undefined || messages === null) return;

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

            if (this.chatHistory.includes(messageId) || this.userId === senderId) {
                const index = await this.getMessageIndex(messages, messageId)
                if (index > -1) messages.splice(index, 1)
            }

            this.chatHistory.push(messageId)
        }

        await handleMessages(messages, this)
        return this.activeChannel && messages;
    }

    async getMessageIndex(messages, messageId) {
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].id === messageId)
                return i
        }

        return -1
    }


    async sendAudio(duration) {
        console.log("Sending audio...");

        await this.evaluate((duration) => {
            var audio = document.createElement("audio");
            audio.setAttribute("src", "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3");
            audio.setAttribute("crossorigin", "anonymous");
            audio.setAttribute("controls", "");
            audio.onplay = function () {
                var stream = audio.captureStream();
                navigator.mediaDevices.getUserMedia = async function () {
                    return stream;
                };
            };
            document.querySelector("body").appendChild(audio);
            // setTimeout(() => {
            //     document.querySelector("body").removeChild(audio);

            // }, duration)
            audio.play();

        });
        await this.clickElementById('button', 'UserAudio');
        await this.waitForTimeout(duration);
    }

    async stopAudio(bot) {
        console.log("Stop audio...");
        await this.clickElementById('button', 'UserAudio');
    }

    async recvAudio(duration) {
        console.log("Receiving audio...");
        await this.waitForSelector('[class*=PartyParticipantWindow]', duration);
    }

    async sendVideo(duration) {
        console.log("Sending video...");
        await this.clickElementById('button', 'UserVideo');
        await this.waitForTimeout(duration);
    }

    async stopVideo(bot) {
        console.log("Stop video...");
        await this.clickElementById('button', 'UserVideo');
    }

    async recvVideo(duration) {
        console.log("Receiving video...");
        await this.waitForSelector('[class*=PartyParticipantWindow]', duration);
    }

    async delay(timeout) {
        console.log(`Waiting for ${timeout} ms... `);
        await this.waitForTimeout(timeout);
    }

    async interactObject() {

    }

    /** Return screenshot
 * @param {Function} fn Function to execut _in the node context._
 */
    async screenshot() {
        return await this.page.screenshot();
    }


    /** Runs a function and takes a screenshot if it fails
     * @param {Function} fn Function to execut _in the node context._
     */
    async catchAndScreenShot(fn, path = "botError.png") {
        try {
            await fn()
        }
        catch (e) {
            if (this.page) {
                warn("Caught error. Trying to screenshot")
                this.page.screenshot({ path })
            }
            console.error(e);
        }
    }

    /**
     * Runs a function in the browser context
     * @param {Function} fn Function to evaluate in the browser context
     * @param args The arguments to be passed to fn. These will be serialized when passed through puppeteer
     */
    async evaluate(fn, ...args) {
        if (!this.browser) {
            await this.launchBrowser();
        }
        return await this.page.evaluate(fn, ...args)
    }

    /**
     * A main-program type wrapper. Runs a function and quits the bot with a
     * screenshot if the function throws an exception
     * @param {Function} fn Function to evaluate in the node context
     */
    exec(fn) {
        this.catchAndScreenShot(() => fn(this)).catch((e) => {
            console.error("Failed to run. Check botError.png if it exists. Error:", e)
        })
    }

    /** Launches the puppeteer browser instance. It is not necessary to call this
     *  directly in most cases. It will be done automatically when needed.
     */
    async launchBrowser() {
        console.log('Launching browser');
        const options = {
            headless: this.headless,
            ignoreHTTPSErrors: true,
            args: [
                "--disable-gpu",
                "--use-fake-ui-for-media-stream=1",
                "--use-fake-device-for-media-stream=1",
                `--use-file-for-fake-video-capture=${this.fakeMediaPath}/video.y4m`,
                `--use-file-for-fake-audio-capture=${this.fakeMediaPath}/audio.wav`,
                '--disable-web-security=1',
                //     '--use-fake-device-for-media-stream',
                //     '--use-file-for-fake-video-capture=/Users/apple/Downloads/football_qcif_15fps.y4m',
                //     // '--use-file-for-fake-audio-capture=/Users/apple/Downloads/BabyElephantWalk60.wav',
                '--allow-file-access=1',
            ],
            ignoreDefaultArgs: ['--mute-audio'],
            ...detectOsOption()
        };

        this.browser = await browserWindow(options);
        this.page = await this.browser.newPage();
        this.page.on('console', message => {
            if (message.text().startsWith('scene_metadata')) {
                const data = message.text().split('|', 2)
                if (data.length === 2) {
                    const _data = data[1]
                    console.log(`Scene Metadata: Data:${_data}`)
                    // TODO: Replace me with metadata handler
                    // MessageClient.instance.sendMetadata('xr-engine', 'xr-engine', 'xr-engine', data || 'none')
                }
                else
                    console.log(`invalid scene metadata length (${data.length}): ${data}`)
            }
            else if (message.text().startsWith('metadata')) {
                const data = message.text().split('|', 3)
                if (data.length === 3) {
                    const xyz = data[1]
                    const _data = data[2]
                    console.log(`Metadata: Position: ${xyz}, Data: ${_data}`)
                }
                else
                    console.log(`invalid metadata length ${data.length}: ${data}`)
            }
            else if (message.text().startsWith('players|')) {
                const cmd = message.text().split('|')[0]
                const data = message.text().substring(cmd.length + 1)
                console.log(`Players: ${data}`)
            }
            else if (message.text().startsWith('messages|')) {
                const cmd = message.text().split('|')[0]
                const data = message.text().substring(cmd.length + 1)
                console.log(`Messages: ${data}`)
            }
            else if (message.text().startsWith('proximity|')) {
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
            }
            else if (message.text().startsWith('localId|')) {
                const cmd = message.text().split('|')[0]
                const data = message.text().substring(cmd.length + 1)
                console.log('local user id: ' + data)
                if (data !== undefined && data !== '') {
                    this.userId = data
                }
            }
            else if (message.text().startsWith('emotions|')) {
            }

            if (this.autoLog)
                console.log(">> ", message.text())
        })

        this.page.setViewport({ width: 0, height: 0 });
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')

        this.pu = new PageUtils(this);
    }

    async keyPress(key, numMilliSeconds) {
        await this.setFocus('canvas');
        await this.clickElementById('canvas', 'engine-renderer-canvas');
        const interval = setInterval(() => {
            console.log('Pressing', key);
            this.pressKey(key);
        }, 100);
        return new Promise((resolve) => setTimeout(() => {
            console.log('Clearing button press for ' + key, numMilliSeconds);
            this.releaseKey(key);
            clearInterval(interval);
            resolve()
        }, numMilliSeconds));
    }

    async pressKey(keycode) {
        await this.page.keyboard.down(keycode);
    }

    async releaseKey(keycode) {
        await this.page.keyboard.up(keycode);
    }

    async navigate(url) {
        if (!this.browser) {
            await this.launchBrowser();
        }

        let parsedUrl = new URL(url.includes('https') ? url : `https://${url}`);
        parsedUrl.searchParams.set('bot', 'true')
        console.log("parsed url is", parsedUrl);
        const context = this.browser.defaultBrowserContext();
        console.log("permission allow for ", parsedUrl.origin);
        context.overridePermissions(parsedUrl.origin, ['microphone', 'camera']);

        console.log(`Going to ${parsedUrl}`);
        await this.page.goto(parsedUrl, { waitUntil: 'domcontentloaded' });

        /* const granted = await this.page.evaluate(async () => {
             return (await navigator.permissions.query({ name: 'camera' })).state;
         });
        console.log('Granted:', granted);*/
    }

    /** Enters the room specified, enabling the first microphone and speaker found
     * @param {string} roomUrl The url of the room to join
     * @param {Object} opts
     * @param {string} opts.name Name to set as the bot name when joining the room
     */
    async enterRoom(roomUrl, { name = 'bot' } = {}) {
        await this.navigate(roomUrl);
        await this.page.waitForSelector("div[class*=\"instance-chat-container\"]", { timeout: 100000 });

        if (name) {
            this.name = name
        }
        else {
            name = this.name
        }

        this.username_regex = new RegExp(customConfig.instance.get('botName'), 'ig')

        if (this.headless) {
            // Disable rendering for headless, otherwise chromium uses a LOT of CPU
        }

        //@ts-ignore
        if (this.setName != null) this.setName(name)

        await this.page.mouse.click(0, 0);

        await this.delay(10000)

        await this.getUser()
        await this.updateChannelState()

        await this.updateUsername(name)
        await this.delay(10000)
        const index = this.getRandomNumber(0, this.avatars.length - 1)
        console.log(`avatar index: ${index}`)
        await this.updateAvatar(this.avatars[index])
        await this.requestPlayers()
        await this.getUser()
        await setInterval(() => this.getUser(), 1000)
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async updateChannelState() {
        this.activeChannel = await this.evaluate(() => {
            const chatState = globalThis.chatState;
            if (chatState === undefined) {
                return;
            }
            const channelState = chatState.channels;
            const channels = channelState.channels.value;
            const activeChannelMatch = Object.entries(channels).find(([key, channel]) => channels[key].channelType === 'instance');
            console.log("activeChannelMatch: ", activeChannelMatch);
            if (activeChannelMatch && activeChannelMatch.length > 0) {
                const res = deepCopy(activeChannelMatch[1]);

                function deepCopy(obj) {
                    var copy;

                    if (null == obj || "object" != typeof obj) return obj;

                    if (obj instanceof Date) {
                        copy = new Date();
                        copy.setTime(obj.getTime());
                        return copy;
                    }

                    if (obj instanceof Array) {
                        copy = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            copy[i] = deepCopy(obj[i]);
                        }
                        return copy;
                    }

                    if (obj instanceof Object) {
                        copy = {};
                        for (var attr in obj) {
                            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
                        }
                        return copy;
                    }

                    throw new Error("Unable to copy obj! Its type isn't supported.");
                }

                return res
            } else {
                warn("Couldn't get chat state");
                return undefined;
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
        console.log(`updating avatar to: ${avatar}`)

        await this.clickElementById('SPAN', 'Profile_0')
        await this.clickElementById('button', 'CreateIcon')
        await this.clickSelectorByAlt('img', avatar)
        //await this.clickElementById('button', 'confirm-avatar')
    }

    async getUser() {
        this.userId = await this.evaluate(() => {
            return globalThis.userId;
        })
    }

    async waitForTimeout(timeout) {
        return await new Promise(resolve => setTimeout(() => resolve(), timeout));
    }

    async waitForSelector(selector, timeout) {
        return this.page.waitForSelector(selector, { timeout });
    }

    async clickElementByClass(elemType, classSelector) {
        await this.pu.clickSelectorClassRegex(elemType || 'button', classSelector);
    }

    async clickElementById(elemType, id) {
        await this.pu.clickSelectorId(elemType, id);
    }
    async clickSelectorByAlt(elemType, title) {
        await this.pu.clickSelectorByAlt(elemType, title)
    }

    async typeMessage(input, message, clean) {
        if (clean) await this.page.click(`input[name="${input}"]`, { clickCount: 3 });
        await this.page.type(`input[name=${input}`, message);
        //await this.page.keyboard.type(message);
    }

    async setFocus(selector) {
        await this.page.focus(selector);
    }

    /**
     * Leaves the room and closes the browser instance without exiting node
     */
    quit() {
        if (this.page) {
            this.page.close();
        }
        if (this.browser) {
            this.browser.close();
        }
    }
}

export default createXREngineClient