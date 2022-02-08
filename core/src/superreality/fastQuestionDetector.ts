/* eslint-disable no-param-reassign */

const questionStarters = [
  'why',
  'who',
  'whose',
  'whom',
  'where',
  'what',
  "what's",
  'are you',
  'is he',
  'is she',
  'is it',
  'am i',
  'how',
]

export function isQuestion(input: string) {
  input = input.toLowerCase().trim()

  if (input.endsWith('?')) {
    return true
  }

  for (let i = 0; i < questionStarters.length; i++) {
    if (input.startsWith(questionStarters[i])) {
      return true
    }
  }

  return false
}
