/* eslint-disable no-param-reassign */

export default function detectFastGreeting(
  input: string,
  maxLength: number,
  data: string
) {
  input = input.toLowerCase().trim()
  if (input.length > maxLength) {
    return false
  }

  let fastGreetings = data.split('\n')
  fastGreetings = fastGreetings.filter(element => {
    return element !== ''
  })

  for (let i = 0; i < fastGreetings.length; i++) {
    if (input.includes(fastGreetings[i])) {
      return true
    }
  }

  return false
}
