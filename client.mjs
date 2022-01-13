import { WebSocket } from 'ws'
import chalk from 'chalk'
import * as readline from 'readline'
import * as capcon from 'capture-console'
const serverURL = process.argv.slice(2)
const url = serverURL[0] || 'ws://localhost:3000'

const ws = new WebSocket(url)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
let lastConsoleLog = ''
console.log = function (message) {
  process.stdout.write(message + '\n')
}

capcon.startCapture(process.stdout, function (stdout) {
  lastConsoleLog = stdout
})

ws.onopen = function () {
  console.log('connected')
}
ws.onmessage = function (event) {
  if (lastConsoleLog.includes('You:')) {
    process.stdout.write('\r\x1b[K')
  }
  console.log(chalk.blue(event.data))
  sendMessage()
}
ws.onerror = function (event) {
  console.log(`Error: ${event.data}`)
  process.exit(1)
}
ws.onclose = function () {
  console.log('Disconnected')
  process.exit(0)
}

function sendMessage() {
  rl.question('', function (message) {
    ws.send(message)
    console.log(chalk.green('You: ' + message))
    sendMessage()
  })
}
rl.on('close', function () {
  ws.close()
  process.exit(0)
})

sendMessage()
