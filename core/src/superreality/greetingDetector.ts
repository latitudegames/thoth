/* eslint-disable no-param-reassign */
/* eslint-disable require-await */
const fastGreetings = [
  'hi',
  'hey',
  'supp',
  'sup',
  'hello',
  'how are you',
  'hey man',
  'hey dude',
  "how's it going",
  "what's up",
  "what's going on",
  "how's everything",
  'how are things',
  "how's life",
  "how's your day",
  'long time now see',
  "it's been a while",
  'good morning',
  'good afternoon',
  "it's nice to meet you",
  'its nice to meet you',
  'its nice to be here',
  "it's nice to be here",
  'yo',
  'howdy',
]

const maxLength = 10

export default async function detectFastGreeting(input: string) {
  input = input.toLowerCase().trim()

  if (input.length > maxLength) {
    return false
  }

  for (let i = 0; i < fastGreetings.length; i++) {
    if (input.includes(fastGreetings[i])) {
      return true
    }
  }

  return false
}
