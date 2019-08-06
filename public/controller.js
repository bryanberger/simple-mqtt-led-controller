// connect to websocket
const ws = new WebSocket('ws://localhost:3000')

// When the connection is open, send some data to the server
ws.onopen = function() {
  init()
  setInterval(keepAlive, 15000)
}

// Log errors
ws.onerror = function(error) {
  console.log('WebSocket Error ' + error)
}

// Log messages from the server
ws.onmessage = function(e) {
  console.log('Server: ' + e.data)
}

const init = () => {
  // create a new color picker
  const colorWheel = new ReinventedColorWheel({
    // appendTo is the only required property. specify the parent element of the color wheel.
    appendTo: document.getElementById('colorPicker'),

    // initial color (can be specified in hsv / hsl / rgb / hex)
    hsv: [0, 100, 100],
    // hsl: [0, 100, 50],
    // rgb: [255, 0, 0],
    // hex: "#ff0000",

    // appearance
    wheelDiameter: 342,
    wheelThickness: 40,
    handleDiameter: 16,
    wheelReflectsSaturation: true,

    // handler
    onChange: function(color) {
      ws.send(JSON.stringify({ rgb: color.rgb }))
    },
  })

  const on = document.getElementById('on')
  on.addEventListener('click', e => {
    ws.send(JSON.stringify({ status: 'ON' }))
  })

  const off = document.getElementById('off')
  off.addEventListener('click', e => {
    ws.send(JSON.stringify({ status: 'OFF' }))
  })

  const effects = document.getElementById('effects')
  effects.addEventListener('change', e => {
    ws.send(JSON.stringify({ effect: e.target.value }))
  })
}

const keepAlive = () => {
  ws.send(JSON.stringify({ status: 'ping' }))
}

// // set color in HSV / HSL / RGB / HEX
// colorWheel.rgb = [255, 128, 64]
// colorWheel.hsl = [120, 100, 50]
// colorWheel.hsv = [240, 100, 100]
// colorWheel.hex = '#888888'

// // get color in HSV / HSL / RGB / HEX
// console.log('hsv:', colorWheel.hsv[0], colorWheel.hsv[1], colorWheel.hsv[2])
// console.log('hsl:', colorWheel.hsl[0], colorWheel.hsl[1], colorWheel.hsl[2])
// console.log('rgb:', colorWheel.rgb[0], colorWheel.rgb[1], colorWheel.rgb[2])
// console.log('hex:', colorWheel.hex)

// // please call redraw() after changing some appearance properties.
// colorWheel.wheelDiameter = 400
// colorWheel.wheelThickness = 40
// colorWheel.redraw()
