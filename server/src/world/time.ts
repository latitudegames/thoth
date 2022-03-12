export class time {
  static instance: time

  start: Date
  now: Date

  constructor() {
    time.instance = this

    this.start = new Date()
  }

  //time since the start of the being in ms
  time() {
    this.now = new Date()
    return (this.now.valueOf() - this.start.valueOf()) / 1000
  }
}

export default time
