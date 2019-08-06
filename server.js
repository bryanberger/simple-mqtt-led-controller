require('dotenv').config()

const path = require('path')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const port = process.env.PORT || 3000

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://192.168.1.190:1883', {
  username: process.env.HA_USER,
  password: process.env.HA_PWD,
})

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(express.static('public'))
app.use('/', express.static(path.join(__dirname, 'public')))
// app.listen(port, () => console.log(`Server listening on port ${port}!`))

const setStatus = status => {
  client.publish('home/bed/set', `{ "state": ${status} }`)
}

const setEffect = effect => {
  client.publish('home/bed/set', `{ "effect": ${effect} }`)
}

const setRGB = rgb => {
  client.publish(
    'home/bed/set',
    `{"state": "ON", "color": {"r": ${rgb[0]}, "g": ${rgb[1]}, "b": ${
      rgb[2]
    }}}`,
  )
}

wss.on('connection', ws => {
  ws.on('message', message => {
    const obj = JSON.parse(message)

    if (obj.rgb) setRGB(obj.rgb)
    if (obj.status) setStatus(obj.status)
    if (obj.effect) setEffect(obj.effect)
  })

  ws.send('Connected!')
})

client.on('connect', function(e) {
  console.log(e)
  // client.publish('home/bed/set', 'ON')
  client.subscribe('home/bed/set')
})

client.on('message', function(topic, message) {
  // message is Buffer
  const msg = message.toString()

  console.log(msg)
})

// start server
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port} :)`)
})
