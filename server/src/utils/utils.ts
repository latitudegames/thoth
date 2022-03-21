const punctRE =
  /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g
const spaceRE = /\s+/g
import nlp from 'compromise'

export function removePanctuationalMarks(str: string): string {
  return str.replace(punctRE, '').replace(spaceRE, ' ')
}

export function simplifyWords(words: string[]): string[] {
  for (let i = 0; i < words.length; i++) {
    const doc = nlp(words[i])
    doc.nouns().toSingular().toLowerCase()
    doc.verbs().toPresentTense().toLowerCase()
    words[i] = doc.text()
  }

  return words
}

export function includeInFields(arr: string[], words: string[]): number {
  let count = 0
  for (let i = 0; i < words.length; i++) {
    let filtered = arr.filter(el => el.includes(words[i]))
    if (filtered.length) count++
  }
  return count
}
