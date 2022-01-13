const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)
const ws = require('ws')
const WebSocketServer = ws.Server
const wss = new WebSocketServer({ server })

wss.on('connection', function connection (ws, req) {
  ws.send('Welcome to the websocket server!')
  wss.clients.forEach(function each (client) {
    if (client !== ws && client.readyState === ws.OPEN) {
      client.send(`${req.socket.remoteAddress} has joined the chat`)
    }
  })
  ws.on('message', function incoming (message) {
    wss.clients.forEach(function each (client) {
      if (client !== ws) {
        client.send(`${req.socket.remoteAddress}:${message}`)
      }
    })
  })
  ws.on('close', function close () {
    wss.clients.forEach(function each (client) {
      if (client !== ws) {
        client.send(`${req.socket.remoteAddress} has left the chat.`)
      }
    })
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
