/* eslint-disable no-param-reassign */
import nlp from 'compromise'
nlp.extend('compromise-sentences')

const questionStarters = [
  'why',
  'who',
  'whose',
  'whom',
  'where',
  'what',
  "what's",
]

export function isQuestion(input: string) {
  const s = nlp(input)
  const sentences = s.sentences()
  if (sentences.length() > 0) {
    return true
  }

  input = input.toLowerCase().trim()

  for (let i = 0; i < questionStarters.length; i++) {
    if (input.startsWith(questionStarters[i])) {
      return true
    }
  }

  return false
}
