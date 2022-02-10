/* eslint-disable no-param-reassign */
export function fastProfanityDetector(input: string, words: string) {
  if (nWord(input) || nazi(input)) {
    return { res: true, type: 'offensive' }
  }

  const list: { [key: string]: string } = {}
  let wordsArray = words.split('\n')
  wordsArray = wordsArray.filter(element => {
    return element !== ''
  })

  for (let i = 0; i < wordsArray.length; i++) {
    const data = wordsArray[i].split(',')
    if (data.length !== 2) continue

    const word = data[0].trim().toLowerCase()
    const type = data[1].trim().toLowerCase()
    list[word] = type
  }

  input = input.toLowerCase().trim()
  for (const x in list) {
    if (input.includes(x)) {
      return { res: true, type: list[x] }
    }
  }

  return { res: false, type: '' }
}

//check if a text contains the n* word
function nWord(text: string) {
  const r = new RegExp(`n+[i1l|]+[gkq469]+[e3a4i]+[ra4]s?`)
  return r.test(text)
}

//check if a text contains the nazi word
function nazi(text: string) {
  const r = new RegExp(`n+[a4|]+[z]+[i1l]s?`)
  return r.test(text)
}
