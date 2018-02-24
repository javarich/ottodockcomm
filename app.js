
const Gpio = require('pigpio').Gpio
const express = require('express')

const Direction = {
    IN: false,
    OUT: true
}

const app = express()


function SingleControlPin(inPin) {
    var pin = new Gpio(inPin, { mode: Gpio.OUTPUT })

    this.direction = Direction.IN
    
    this.set = function() {
        pin.digitalWrite(1)
    }

    this.reset = function() {
        pin.digitalWrite(0)
    }
}

function DualControlPin(inPin, outPin) {
    var inGpio = new Gpio(inPin, { mode: Gpio.OUTPUT })
    var outGpio = new Gpio(outPin, { mode: Gpio.OUTPUT })

    this.direction = Direction.IN
    
    this.set = function() {
        if (this.direction == Direction.IN) {
            inGpio.digitalWrite(1)
            outGpio.digitalWrite(0)
        } else {
            inGpio.digitalWrite(0)
            outGpio.digitalWrite(1)
        }
    }

    this.reset = function() {
        inGpio.digitalWrite(0)
        outGpio.digitalWrite(0)
    }
}

var components = {
    'masterPower': new SingleControlPin(4),
    'leftWinch': new DualControlPin(17, 27),
    'rightWinch': new DualControlPin(22, 5),
    'murray': new DualControlPin(14, 15)
}


app.get('/api/controls', function(req, res) {
    try {
        var controlName = req.query.control;
        var state = req.query.state == 'true'

        if (req.query.control == 'direction') {
            for (let component in components) {
                components[component].direction = state
                components[component].set()
            }
            console.log('Direction toggled to ' + (state ? 'OUT' : 'IN'))
            res.send('Direction toggled to ' + (state ? 'OUT' : 'IN'))
        } else {
            console.log('MCP control %o setting to', controlName, state)
            res.send(controlName + ': ' + state)
            if (state) {
                components[controlName].set()
            } else {
                components[controlName].reset()
            }
        }
    } catch (err) {
        console.log(err) //Gotta catch em all... Express handlers swallow all exceptions.
    }
})

app.use(express.static('public'))

for (let component in components) { //GPIO pins are initialized to HIGH if I remember correctly.
    components[component].reset()
}

app.listen(3000, () => console.log('OttoDock Comm listening on port 3000'))

