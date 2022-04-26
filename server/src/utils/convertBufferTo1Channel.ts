import { Transform } from 'stream'

export function convertBufferTo1Channel(buffer: any) {
  let length = buffer.length / 2
  const convertedBuffer = Buffer.alloc(length)
  console.log('new length:', length, '-', convertedBuffer.length)

  for (let i = 0; i < convertedBuffer.length / 2; i++) {
    const uint16 = buffer.readUInt16LE(i * 4)
    console.log(
      'length',
      convertedBuffer.length,
      'needed length:',
      i * 2 - 1 >= 0 ? i * 2 - 1 : i * 2
    )
    convertedBuffer.writeUInt16LE(uint16, i * 2 - 1 >= 0 ? i * 2 - 1 : i * 2)
  }

  return convertedBuffer
}

export class ConvertTo1ChannelStream extends Transform {
  constructor(source: any, options: any) {
    super(options)
  }

  _transform(data: any, encoding: any, next: any) {
    next(null, convertBufferTo1Channel(data))
  }
}
