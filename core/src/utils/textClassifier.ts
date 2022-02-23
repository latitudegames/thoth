/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import fs from 'fs'
import natural from 'natural'
import path from 'path'

let classifier: any
let profanityClassifier: any

const rootDir = path.resolve(path.dirname(''))
export async function classifyText(input: any) {
  if (!classifier || classifier === undefined) {
    return ''
  }

  return await classifier.classify(input)
}
export async function classifyProfanityText(input: any) {
  if (!profanityClassifier || profanityClassifier === undefined) {
    return ''
  }

  return await profanityClassifier.classify(input)
}

export function trainClassifier() {
  const lines = fs
    .readFileSync(rootDir + '/data/classifier/training_data.txt')
    .toString()
    .split('\n')
  for (let i = 0; i < lines.length; i++) {
    const data = lines[i].trim().split('|')
    if (data.length !== 2) {
      continue
    }

    classifier.addDocument(data[0].trim(), data[1].trim())
  }

  classifier.train()
  classifier.save(
    rootDir + '/data/classifier/classifier.json',
    function (err: any) {
      if (err) {
        return console.error(err)
      }
    }
  )
}
export function trainProfanityClassifier() {
  const lines = fs
    .readFileSync(rootDir + '/data/classifier/profanity_data.txt')
    .toString()
    .split('\n')
  for (let i = 0; i < lines.length; i++) {
    profanityClassifier.addDocument(lines[i], 'profane')
  }

  profanityClassifier.train()
  profanityClassifier.save(
    rootDir + '/data/classifier/profanity_classifier.json',
    (err: any) => {
      if (err) {
        console.error(err)
        return
      }
    }
  )
}

export async function initClassifier() {
  if (fs.existsSync(rootDir + '/data/classifier/classifier.json')) {
    await natural.BayesClassifier.load(
      rootDir + '/data/classifier/classifier.json',
      null,
      async function (err: any, _classifier: any) {
        if (err) {
          console.error(err)
          classifier = new natural.BayesClassifier()
          await trainClassifier()
          return
        }
        classifier = _classifier
      }
    )
  } else {
    classifier = new natural.BayesClassifier()
    await trainClassifier()
  }
}
export async function initProfanityClassifier() {
  if (fs.existsSync(rootDir + '/data/classifier/profanity_classifier.json')) {
    await natural.BayesClassifier.load(
      rootDir + '/data/classifier/profanity_classifier.json',
      null,
      async function (err: any, _classifier: any) {
        if (err) {
          console.error(err)
          profanityClassifier = new natural.BayesClassifier()
          await trainProfanityClassifier()
          return
        }
        profanityClassifier = _classifier
      }
    )
  } else {
    profanityClassifier = new natural.BayesClassifier()
    await trainProfanityClassifier()
  }
}
