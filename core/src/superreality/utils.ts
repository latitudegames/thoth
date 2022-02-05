// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { customConfig } from '@latitudegames/thoth-core/src/superreality/customConfig'
import { existsSync } from 'fs'

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//Empty responses in-case of an agent error in order to avoid crashing the client bots
export const emptyResponse = [
  'Idk',
  'You tell me',
  'If you tell me, we will both know',
  "It's a secret",
  'Some things you should figure by your self',
  'No you',
  "I don'n know",
]
export function getRandomEmptyResponse() {
  return emptyResponse[getRandomNumber(0, emptyResponse.length - 1)]
}

export function startsWithCapital(word) {
  return word.charAt(0) === word.charAt(0).toUpperCase()
}

export function getOS() {
  const platform = process.platform
  let os
  if (platform.includes('darwin')) {
    os = 'Mac OS'
  } else if (platform.includes('win32')) {
    os = 'Windows'
  } else if (platform.includes('linux')) {
    os = 'Linux'
  }

  return os
}

//returns the Chrome path for puppeteer based on the OS
export function detectOsOption() {
  const os = getOS()
  const options = { executablePath: null }
  let chromePath = ''
  switch (os) {
    case 'Mac OS':
      chromePath =
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      break
    case 'Windows':
      chromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
      break
    case 'Linux':
      chromePath = '/usr/bin/google-chrome'
      break
    default:
      break
  }

  if (chromePath) {
    if (existsSync(chromePath)) {
      options.executablePath = chromePath
    } else {
      console.log(
        'Warning! Please install Google Chrome to make bot workiing correctly in headless mode.\n'
      )
    }
  }
  return options
}

export function convertLocalToUtcTimezone(date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function getRandomTopic() {
  const topics = customConfig.instance
    .get('discussion_channel_topics')
    .split('|')
  return topics[getRandomNumber(0, topics.length - 1)]
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function randomFloat(min, max) {
  return Math.random() * (max - min + 1) + min
}

export class idGenerator {
  id = 0

  getId() {
    return this.id++
  }

  reset() {
    this.id = 0
  }
}
