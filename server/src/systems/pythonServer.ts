import { spawn } from 'child_process'
import * as fs from 'fs'
import path from 'path'

export default async function spawnPythonServer() {
  const _path = path.resolve(__dirname, '../../../pyserver') + '/main.py'
  console.log('_path:', _path)
  if (!fs.existsSync(_path)) {
    console.error('Python server not found!')
    return
  }

  console.log('SPAWNING PYTOHN SERVER!!!!!!!!')

  const process = spawn('python3', [_path])
  process.stdout.on('data', data => {
    console.log('>> ', data.toString())
  })
  process.stderr.on('data', data => {
    console.log('>> ', data.toString())
  })
  process.stdin.on('data', data => {
    console.log('>> ', data.toString())
  })
}
