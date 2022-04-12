/* eslint-disable no-param-reassign */
/* eslint-disable require-await */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { launch } from 'puppeteer-stream'
import Xvfb from 'xvfb'
import { detectOsOption, getSetting } from './utils'

export class zoom_client {
  async createZoomClient(agent, settings) {
    const xvfb = new Xvfb()
    await xvfb.start(async function (err, xvfbProcess) {
      if (err) {
        log(err)
        xvfb.stop(function (_err) {
          if (_err) log(_err)
        })
      }

      log('started virtual window')
      const zoomObj = new zoom(agent, settings)
      await zoomObj.init()
    })
  }
}

export class zoom {
  agent
  settings
  fakeMediaPath

  browser
  page

  constructor(agent, settings, fakeMediaPath = '') {
    this.agent = agent
    this.settings = settings
    this.fakeMediaPath = fakeMediaPath
  }

  async init() {
    const options = {
      headless: false,
      ignoreHTTPSErrors: true,
      devtools: true,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        //`--use-file-for-fake-video-capture=${this.fakeMediaPath}video.y4m`,
        //`--use-file-for-fake-audio-capture=${this.fakeMediaPath}test_audio.wav`,
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required',
        '--ignoreHTTPSErrors: true',
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      ...detectOsOption(),
    }
    log(JSON.stringify(options))

    this.browser = await launch(options)
    this.page = await this.browser.newPage()
    this.page.on('console', log => console.log(log._text))

    this.page.setViewport({ width: 0, height: 0 })
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    )
    await this.navigate(getSetting(this.settings, 'zoomInvitationLink'))
    await this.delay(20000)
    await this.typeMessage('inputname', agent.name, false)
    await this.clickElementById('button', 'joinBtn')
    await this.delay(20000)
    await this.clickElementById('button', 'wc_agree1')
    await this.delay(20000)
    try {
      await this.typeMessage(
        'inputpasscode',
        getSetting(this.settings, 'zoomPassword'),
        false
      )
      await this.clickElementById('button', 'joinBtn')
      await this.delay(20000)
    } catch (ex) { }

    await this.playVideo('https://woolyss.com/f/spring-vp9-vorbis.webm')

    await this.clickElementById('button', 'audioOptionMenu')
    await this.catchScreenshot()
    const linkHandlers = await this.page.$x(
      "//a[contains(text(), 'Fake Audio Input 1')]"
    )

    if (linkHandlers.length > 0) {
      await linkHandlers[0].click()
    } else {
      throw new Error('Link not found')
    }
    await this.clickElementById('button', 'videoOptionMenu')
    await this.catchScreenshot()
    const linkHandlers2 = await this.page.$x(
      "//a[contains(text(), 'fake_device_0')]"
    )
    if (linkHandlers2.length > 0) {
      await linkHandlers2[0].click()
    } else {
      throw new Error('Link not found')
    }

    await this.clickElementById('button', 'audioOptionMenu')
    await this.catchScreenshot()
    const linkHandlers3 = await this.page.$x(
      "//a[contains(text(), 'Fake Audio Output 1')]"
    )

    if (linkHandlers3.length > 0) {
      await linkHandlers3[0].click()
    } else {
      throw new Error('Link not found')
    }

    await this.clickElementById('button', 'audioOptionMenu')
    await this.catchScreenshot()
    await this.getVideo()
    this.frameCapturerer()
  }

  frameCapturerer() {
    setTimeout(() => {
      this.getRemoteScreenshot()
      this.frameCapturerer()
    }, 500)
  }

  c = 0
  async getRemoteScreenshot() {
    const dataUrl = await this.page.evaluate(async () => {
      const sleep = time => new Promise(resolve => setTimeout(resolve, time))
      await sleep(5000)
      return document.getElementById('main-video').toDataURL()
    })

    this.c++
    const data = Buffer.from(dataUrl.split(',').pop(), 'base64')
    //fs.writeFileSync('image' + this.c + '.png', data);
  }

  async getVideo() {
    await this.page.evaluate(async () => {
      const video = document.getElementById('main-video')
      const stream = video.captureStream()
      const recorder = new MediaRecorder(stream)
      recorder.addEventListener('error', error => {
        log('recorder error: ' + error)
      })
      recorder.addEventListener('dataavailable', ({ data }) => {
        log('data: ' + JSON.stringify(data))
      })
      recorder.start(5000)
      log(stream.id)
    })
  }

  videoCreated = false
  async playVideo(url) {
    await this.page.evaluate(
      async (_url, _videCreated) => {
        let video = undefined
        if (!this.videoCreated)
          video = await document.createElement('video', {})
        else video = await document.getElementById('video-mock')
        video.setAttribute('id', 'video-mock')
        video.setAttribute('src', _url)
        video.setAttribute('crossorigin', 'anonymous')
        video.setAttribute('controls', '')

        video.oncanplay = async () => {
          video.play()
        }

        video.onplay = async () => {
          const stream = video.captureStream()

          navigator.mediaDevices.getUserMedia = () => Promise.resolve(stream)
        }
      },
      url,
      this.videoCreated
    )
    this.videoCreated = true
    await this.delay(10000)
  }

  async clickElementById(elemType, id) {
    await this.clickSelectorId(elemType, id)
  }

  async clickSelectorId(selector, id) {
    log(`Clicking for a ${selector} matching ${id}`)

    await this.page.evaluate(
      (selector, id) => {
        const matches = Array.from(document.querySelectorAll(selector))
        const singleMatch = matches.find(button => button.id === id)
        let result
        if (singleMatch && singleMatch.click) {
          log('normal click')
          result = singleMatch.click()
        }
        if (singleMatch && !singleMatch.click) {
          log('on click')
          result = singleMatch.dispatchEvent(
            new MouseEvent('click', { bubbles: true })
          )
        }
        if (!singleMatch) {
          log('event click', matches.length)
          if (matches.length > 0) {
            const m = matches[0]
            result = m.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          }
        }
      },
      selector,
      id
    )
  }

  async clickElementByClass(elemType, classSelector) {
    await this.clickSelectorClassRegex(elemType || 'button', classSelector)
  }

  async clickSelectorClassRegex(selector, classRegex) {
    log(`Clicking for a ${selector} matching ${classRegex}`)

    await this.page.evaluate(
      (selector, classRegex) => {
        classRegex = new RegExp(classRegex)
        const buttons = Array.from(document.querySelectorAll(selector))
        const enterButton = buttons.find(button =>
          Array.from(button.classList).some(c => classRegex.test(c))
        )
        if (enterButton) enterButton.click()
      },
      selector,
      classRegex.toString().slice(1, -1)
    )
  }

  async navigate(url, searchParams = undefined) {
    if (!this.browser) {
      await this.init()
    }

    const parsedUrl = new URL(url?.includes('https') ? url : `https://${url}`)
    if (searchParams !== undefined) {
      for (const x in searchParams) {
        parsedUrl.searchParams.set(x, searchParams[x])
      }
    }
    const context = this.browser.defaultBrowserContext()
    context.overridePermissions(parsedUrl.origin, ['microphone', 'camera'])
    log('navigating to: ' + parsedUrl)
    await this.page.goto(parsedUrl, { waitUntil: 'domcontentloaded' })
  }

  async delay(timeout) {
    log(`Waiting for ${timeout} ms... `)
    await this.waitForTimeout(timeout)
  }

  async waitForTimeout(timeout) {
    return await new Promise(resolve => setTimeout(() => resolve(), timeout))
  }

  async waitForSelector(selector, timeout) {
    return this.page.waitForSelector(selector, { timeout })
  }

  counter = 0
  async catchScreenshot() {
    this.counter++
    log('screenshot')
    const path = 'screenshot' + this.counter + '.png'
    await this.page.screenshot({ path })
  }

  async typeMessage(input, message, clean) {
    if (clean)
      await this.page.click(`input[name="${input}"]`, { clickCount: 3 })
    await this.page.type(`input[name=${input}`, message)
  }
}
