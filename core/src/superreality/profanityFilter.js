import { profanity } from '@2toad/profanity'
import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import grawlix from 'grawlix'
import grawlixRacism from 'grawlix-racism'

import { makeCompletionRequest } from './makeCompletionRequest.js'
import { makeModelRequest } from './makeModelRequest.js'
import { classifyProfanityText } from './textClassifier.js'
import { database } from './database'

//check if a text contains the n* word
function nWord(text) {
    const r = new RegExp(`n+[i1l|]+[gkq469]+[e3a4i]+[ra4]s?`)
    return r.test(text)
}

//check if a text contains the nazi word
function nazi(text) {
    const r = new RegExp(`n+[a4|]+[z]+[i1l]s?`)
    return r.test(text)
}

const wordSensitivity = 0.1 // percentage of text that is sensitive
const toxicityThreshold = 0.4
const leadingToxicityThreshold = 0.2

let badWords
let sensitiveWords
let sensitivePhrases
let leadingStatements

//loads all the predefined words and phrases for the profanity system
export async function initProfanityFilter() {
    // TODO: remove punctuation from phrases and words before testing
    badWords = (await database.instance.getBadWords()).toString().split('\n')
    sensitiveWords = (await database.instance.getSensitiveWords())
        .toString()
        .trim()
        .split('\r\n')
    sensitivePhrases = (await database.instance.getSensitivePhrases())
        .toString()
        .split('\n')
    leadingStatements = (await database.instance.getLeadingStatements())
        .toString()
        .split('\n')

    profanity.addWords(badWords)
}

function testIfContainsSensitiveWords(text) {
    // return true if text contains any of the filter words
    return sensitiveWords.filter(word => {
        return text.toLowerCase().includes(word.toLowerCase())
    }).length
}

function testIfContainsSensitivePhrases(text) {
    // return number of matches
    return sensitivePhrases.filter(phrase => {
        return text.toLowerCase().includes(phrase.toLowerCase())
    }).length
}

function testIfContainsLeadingStatements(text) {
    // return number of matches
    return (
        leadingStatements.filter(phrase => {
            return text.toLowerCase().includes(phrase.toLowerCase())
        }).length > 0
    )
}

function getWordCount(text) {
    return text.split(' ').length
}

//gets the toxicity threshold of a text
async function testIfIsToxic(text, threshold) {
    if (customConfig.instance.get('hf_api_token')) {
        const result = await makeModelRequest(text, 'unitary/toxic-bert')
        result[0].forEach(sentence => {
            if (sentence.score > threshold) {
                return true
            }
        })
    } else return false
}

grawlix.setDefaults({
    plugin: grawlixRacism,
})

export async function evaluateTextAndRespondIfToxic(
    speaker,
    agent,
    textIn,
    evaluateAllFilters
) {
    const text = textIn?.trim().replace("'", '')
    const profaneResponses = (
        await database.instance.getSpeakerProfaneResponses(agent)
    )
        .toString()
        .replaceAll('\n\n', '\n')
        .replace("'", '')
        .split('\n')
    const sensitiveResponses = (
        await database.instance.getSensitiveResponses(agent)
    )
        .toString()
        .replaceAll('\n\n', '\n')
        .replace("'", '')
        .split('\n')

    // If it's profane or blatantly offensive, shortcut to a response
    const isProfane = profanity.exists(text) || !text.includes(grawlix(text))
    const isBlatantlyOffensive = nazi(text) || nWord(text)

    // The user said the n word or started talking about nazis
    if (isBlatantlyOffensive) {
        const response =
            profaneResponses[Math.floor(Math.random() * profaneResponses.length)]
        return { isProfane: true, response }
    }

    // The user said something profane
    if (isProfane) {
        const response =
            profaneResponses[Math.floor(Math.random() * profaneResponses.length)]
        return { isProfane: true, response }
    }

    // If it's not blatantly offensive, check if it contains sensitive words or context
    const sensitiveWordsLength = testIfContainsSensitiveWords(text)
    const hasSensitiveWords =
        sensitiveWordsLength / getWordCount(text) > wordSensitivity
    const hasSensitivePhrases = testIfContainsSensitivePhrases(text)

    // Check if the agent is being lead to saying something based on an assuption
    const isLeadingStatement = testIfContainsLeadingStatements(text)

    // If the text contains sensitive words and phrases, or contains sensitive words and a leading statement, or contains a leading statement and a sensitive phrase, then it's sensitive
    const isSensitive =
        hasSensitiveWords ||
        (sensitiveWordsLength > 0 && hasSensitivePhrases) ||
        (hasSensitiveWords && isLeadingStatement) ||
        (isLeadingStatement && hasSensitivePhrases)

    if (isSensitive) {
        const response =
            sensitiveResponses[Math.floor(Math.random() * sensitiveResponses.length)]
        return { isProfane: true, response }
    }

    if (!evaluateAllFilters) return { isProfane: false }

    const response =
        sensitiveResponses[Math.floor(Math.random() * sensitiveResponses.length)]

    // Check if text is overall toxic
    const isToxic = await testIfIsToxic(
        text,
        isLeadingStatement ? toxicityThreshold : leadingToxicityThreshold
    )
    if (isToxic) {
        return { isProfane: true, response }
    }

    if (await filterWithOpenAI(speaker, agent, text).shouldFilter) {
        return { isProfane: true, response }
    }

    if (await filterByRating(speaker, agent, text).shouldFilter) {
        return { isProfane: true, response }
    }

    if (!isProfane) {
        const r = classifyProfanityText(textInt)
        if (r === 'profane') {
            return {
                isProfane: true,
                response: await filterWithOpenAI(speaker, agent, textInt),
            }
        }
    }

    return { isProfane: false, response: null }
}

async function filterWithOpenAI(speaker, agent, text) {
    // Should we filter sensitive information?
    // TODO: Should be agent specific, default to common
    const { filterSensitive } = JSON.parse(
        (await database.instance.getAgentsConfig(agent)).toString()
    )

    // Create API object for OpenAI
    const data = {
        prompt: text,
        temperature: 0.5,
        max_tokens: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['\n'],
    }

    // By default, set filter to false
    const shouldFilter = false

    // Make the request
    const { success, choice } = await makeCompletionRequest(
        data,
        speaker,
        agent,
        'filter',
        'content-filter-alpha'
    )

    // If request failed, return
    if (!success) {
        return { shouldFilter: false }
    }

    // If it succeeds and is sensitive, filter it
    if (success && filterSensitive && choice.text === '1') {
        return { shouldFilter: true }
    }
    // If it's harmful, always filter it
    else if (success && choice.text === '2') {
        return { shouldFilter: true }
    }

    return { success, choice, shouldFilter }
}

async function filterByRating(speaker, agent, text) {
    // get ESRB rating for agent
    const ratingPrompt = (await database.instance.getRating(agent)).toString()
    const textToEvaluate = ratingPrompt
        .replace('$text', speaker + ': ' + text + `\n${agent}: ${text}`)
        .replaceAll('$speaker', speaker)
        .replaceAll('$agent', agent)

    // Create API object for OpenAI
    const data = {
        prompt: textToEvaluate,
        temperature: 0.5,
        max_tokens: 20,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['\n'],
    }

    // Make the request
    const { success, choice } = await makeCompletionRequest(
        data,
        speaker,
        agent,
        'rating'
    )

    // If it's for everyone, just allow it
    const isForEveryone = await validateESRB(agent, text, true)

    // Otherwise, check if it meets the agent maximum rating
    const shouldFilter = !isForEveryone && (await validateESRB(agent, text))

    return { success, choice, shouldFilter }
}

//ESRB stands for: Entertainment Software Rating Board
async function validateESRB(agent, text, checkIfForEveryone) {
    const { contentRating } = JSON.parse(
        (await database.instance.getAgentsConfig(agent)).toString()
    )

    const ratings = {
        everyone: /(?:everyone|pending|rp|10)/i,
        pending: /(?:everyone|pending|10)|/i,
        teen: /(?:everyone|teen|pending|10)/i,
        mature: /(?:everyone|teen|mature|pending|17|10)/i,
        adult: /(?:everyone|teen|mature|adult|nr|pending|18|17|10)/i,
    }

    const ratingsShort = {
        everyone: /\b(?:e|e10|rp)\b/i,
        pending: /\b(?:e|e10|e10|rp)|\b/i,
        teen: /\b(?:e|e10|t|rp)\b/i,
        mature: /\b(?:e|e10|t|m|p|rp)\b/i,
        adult: /\b(?:e|e10|t|m|a|nr|rp|ao)\b/i,
    }

    const regex =
        ratings[checkIfForEveryone ? 'everyone' : contentRating.toLowerCase()]
    const matchedEasy = regex.test(text)

    if (matchedEasy) {
        return !matchedEasy
    }

    const regexShort =
        ratingsShort[checkIfForEveryone ? 'everyone' : contentRating.toLowerCase()]

    return !regexShort.test(text.substring(0, 3))
}
