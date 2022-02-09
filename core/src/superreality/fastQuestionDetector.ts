/* eslint-disable no-param-reassign */
export function isQuestion(input: string, data: string) {
  input = input.toLowerCase().trim()

  if (input.endsWith('?')) {
    return true
  }

  let questionStarters = data.split('\n')
  questionStarters = questionStarters.filter(element => {
    return element !== ''
  })

  for (let i = 0; i < questionStarters.length; i++) {
    if (input.startsWith(questionStarters[i])) {
      return true
    }
  }

  return false
}
