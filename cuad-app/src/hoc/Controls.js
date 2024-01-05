import React, {Component} from 'react';
// import Gamepad from 'react-gamepad'
import $ from 'jquery';


class Controls extends Component {
    timeout = null;
    keycodes = 
        {
            "1" : {"pin":0, "player":"P3", "button":"calibrate"},
            "5" : {"pin":11, "player":"P3", "button":"coin"},
            "7" : {"pin":33, "player":"P1", "joystick":"black", "direction":"Left"},
            "8" : {"pin":31, "player":"P1", "joystick":"black", "direction":"Right"},
            "9" : {"pin":35, "player":"P2", "joystick":"black", "direction":"Left"},
            "0" : {"pin":37, "player":"P2", "joystick":"black", "direction":"Right"},


            "q" : {"pin":3, "output_led":26, "player":"P2", "button":"start"},
            "w" : {"pin":4, "output_led":59, "player":"P2", "button":"blue"},
            "e" : {"pin":6, "output_led":60, "player":"P2", "button":"red"},
            "r" : {"pin":7, "output_led":19, "player":"P2", "button":"green"},
            "t" : {"pin":5, "output_led":58, "player":"P2", "button":"yellow"},
            "y" : {"pin":10, "player":"P2", "button":"pedal"},
            "u" : {"pin":23, "player":"P2", "joystick":"blue", "direction":"Right"},
            "i" : {"pin":25, "player":"P2", "joystick":"blue", "direction":"Left"},
            "o" : {"pin":30, "player":"P2", "joystick":"red", "direction":"Left"},
            "p" : {"pin":32, "player":"P2", "joystick":"red", "direction":"Right"},
            "[" : {"pin":8, "output_led":16, "player":"P2", "joystick":"green", "direction":"Right"},
            "]" : {"pin":9, "output_led":16, "player":"P2", "joystick":"green", "direction":"Left" },
            "a" : {"pin":15, "output_led":17, "player":"P2", "joystick":"yellow", "direction":"Right"},
            "s" : {"pin":12, "output_led":17, "player":"P2", "joystick":"yellow", "direction":"Left"},

            "d" : {"pin":50, "output_led":43, "player":"P1", "button":"start"},
            "f" : {"pin":67, "output_led":57, "player":"P1", "button":"blue"},
            "g" : {"pin":46, "output_led":39, "player":"P1", "button":"red"},
            "h" : {"pin":27, "output_led":41, "player":"P1", "button":"green"},
            "j" : {"pin":48, "output_led":42, "player":"P1", "button":"yellow"},
            "k" : {"pin":62, "player":"P1", "button":"pedal"},
            "l" : {"pin":68, "player":"P1", "joystick":"blue", "direction":"Right"},
            "z" : {"pin":69, "player":"P1", "joystick":"blue", "direction":"Left"},
            "x" : {"pin":29, "player":"P1", "joystick":"red", "direction":"Left"},
            "c" : {"pin":52, "player":"P1", "joystick":"red", "direction":"Right"},
            "v" : {"pin":65,  "output_led":38, "player":"P1", "joystick":"green", "direction":"Right"},
            "b" : {"pin":55,  "output_led":38, "player":"P1", "joystick":"green", "direction":"Left"},
            "n" : {"pin":64,  "output_led":54, "player":"P1", "joystick":"yellow", "direction":"Right"},
            "m" : {"pin":63,  "output_led":54, "player":"P1", "joystick":"yellow", "direction":"Left"},
    };
    
    connectHandler(gamepadIndex) {
        // console.log(`Gamepad ${gamepadIndex} connected !`)
    }
        
    disconnectHandler(gamepadIndex) {
        // console.log(`Gamepad ${gamepadIndex} disconnected !`)
    }
    
    buttonChangeHandler_player1(buttonName, down) {  
        // console.log("button");
        
        let buttonColor = null;
        // ABXY
        if (buttonName === "A") {
            buttonColor = "blue";
        }

        if (buttonName === "B") {
            buttonColor = "yellow";
        }

        if (buttonName === "X") {
            buttonColor = "red";
        }

        if (buttonName === "Y") {
            buttonColor = "green";
        }

        if (buttonName === "RS") {
            buttonColor = "start";
        }

        if ( buttonColor) {
            if (down) {
                this.buttonAction("P1", buttonColor, "down");
            } else {
                this.buttonAction("P1", buttonColor, "up");
            }
        }

        if (buttonName === "LS") {
            if (down) {
                this.buttonAction("P1", "pedal", "down");
            } else {
                this.buttonAction("P1", "pedal", "up");
            }
        }

        let joystickColor = null;
        let joystickDirection = null;
        if (buttonName === "RB") {
            joystickColor = "red"
            joystickDirection = "Left"
        }

        if (buttonName === "LB") {
            joystickColor = "red"
            joystickDirection = "Right"
        }

        if (buttonName === "Start") {
            joystickColor = "green"
            joystickDirection = "Left"
        }

        if (buttonName === "Back") {
            joystickColor = "green"
            joystickDirection = "Right"
        }

        if (buttonName === "RT") {
            joystickColor = "yellow"
            joystickDirection = "Right"
        }

        if (buttonName === "LT") {
            joystickColor = "yellow"
            joystickDirection = "Left"
        }

        if (down && joystickColor !== null) {
            this.joystickAction("P1", joystickColor, joystickDirection)
        }
    }
    
    axisChangeHandler_player1(axisName, value, previousValue) {
        if (axisName === "LeftStickY") {
            let joystickColor = "blue";
            let joystickDirection = null;
            if (value === -1) {
                joystickDirection = "Right"
            }
    
            if (value === 1) {
                joystickDirection = "Left"
            }
            if (value !== 0 && joystickColor !== null) {
                this.joystickAction("P1", joystickColor, joystickDirection)
            }
        }
    }

    buttonChangeHandler_player2(buttonName, down) {
        let buttonColor = null;
        // ABXY
        if (buttonName === "A") {
            buttonColor = "blue";
        }

        if (buttonName === "B") {
            buttonColor = "red";
        }

        if (buttonName === "X") {
            buttonColor = "green";
        }

        if (buttonName === "Y") {
            buttonColor = "yellow";
        }

        if (buttonName === "RS") {
            buttonColor = "start";
        }

        if (buttonColor !== null) {
            if (down) {
                this.buttonAction("P2", buttonColor, "down");
            } else {
                this.buttonAction("P2", buttonColor, "up");
            }
        }

        if (buttonName === "LS") {
            if (down) {
                this.buttonAction("P2", "pedal", "down");
            } else {
                this.buttonAction("P2", "pedal", "up");
            }
        }
        
        let joystickColor = null;
        let joystickDirection = null;
        if (buttonName === "RB") {
            // Red Left
            joystickColor = "red"
            joystickDirection = "Left"
        }

        if (buttonName === "LB") {
            // Red Right
            joystickColor = "red"
            joystickDirection = "Right"

        }

        if (buttonName === "Start") {
            // Red Left
            joystickColor = "green"
            joystickDirection = "Left"
        }

        if (buttonName === "Back") {
            // Red Right
            joystickColor = "green"
            joystickDirection = "Right"

        }

        if (buttonName === "RT") {
            // Red Left
            joystickColor = "yellow"
            joystickDirection = "Left"
        }

        if (buttonName === "LT") {
            // Red Right
            joystickColor = "yellow"
            joystickDirection = "Right"

        }

        if (down && joystickColor !== null) {
            this.joystickAction("P2", joystickColor, joystickDirection)
        }
    }
    
    axisChangeHandler_player2(axisName, value, previousValue) {
        if (axisName === "LeftStickX") {
            let joystickColor = "blue";
            let joystickDirection = null;
            if (value === -1) {
                joystickDirection = "Left"
            }
    
            if (value === 1) {
                joystickDirection = "Right"
            }
            if (value !== 0 && joystickColor !== null) {
                this.joystickAction("P2", joystickColor, joystickDirection)
            }
        }
    }

    keyboardActionDown = (event) => {
        // 76
        // 75

        // if (event.keyCode === 75) {
        //     this.joystickAction("P2", "black", "Left")
        // }
        // if (event.keyCode === 76) {
        //     this.joystickAction("P2", "black", "Right")
        // }

        // // 73
        // // 79

        // if (event.keyCode === 73) {
        //     this.joystickAction("P1", "black", "Left")
        // }

        // if (event.keyCode === 79) {
        //     this.joystickAction("P1", "black", "Right")
        // }
    }

    buttonChangeHandler_player3(buttonName, down) {
        // console.log(buttonName, down)
        let player = null;
        let buttonColor = null;
        let joystickDirection = null;

        // ABXY
        if (buttonName === "A") {
            buttonColor = "black";
            player = "P2";
            joystickDirection = "Right";

        }

        if (buttonName === "B") {
            buttonColor = "black";
            player = "P2";
            joystickDirection = "Left";

        }

        if (buttonName === "X") {
            buttonColor = "black";
            player = "P1";
            joystickDirection = "Left";

        }

        if (buttonName === "Y") {
            buttonColor = "black";
            player = "P1";
            joystickDirection = "Right";
        }

        

        if (player !== null) {
            if (down) {
                this.joystickAction(player, buttonColor, joystickDirection);
            }
        }

        if (buttonName === "LB") {
            if (down) {
                this.buttonAction("P3", "hard", "down");
            }
        }
    }

    buttonChangeHandler_player4(buttonName, down) {
        // console.log(buttonName, down)

        if (buttonName === "B") {
            if (down) {
                this.buttonAction("P3", "hard", "down");
            }
        }

        if (buttonName === "A") {
            if (down) {
                this.buttonAction("P3", "coin", "down");
            }
        }
        // let player = null;
        // let buttonColor = null;
        // let joystickDirection = null;
        // // ABXY
        // if (buttonName === "A") {
        //     buttonColor = "black";
        //     player = "P2";
        //     joystickDirection = "Right";

        // }

        // if (buttonName === "B") {
        //     buttonColor = "black";
        //     player = "P2";
        //     joystickDirection = "Left";

        // }

        // if (buttonName === "X") {
        //     buttonColor = "black";
        //     player = "P1";
        //     joystickDirection = "Left";

        // }

        // if (buttonName === "Y") {
        //     buttonColor = "black";
        //     player = "P1";
        //     joystickDirection = "Right";

        // }

        // if (player !== null) {
        //     if (down) {
        //         this.joystickAction(player, buttonColor, joystickDirection);
        //     }
        // }
    }

    keyboardActionUp = (event) => {
        if (event.key === 1) {
            
        }
    }

    buttonAction(player, color, action) {

        this.props.buttonHandler(player, "button-"+color, action);
        // console.log(player + " Button: " + action);

        this.resetTimeout();
    }

    joystickAction(player, color, direction) {
        this.props.buttonHandler(player, "joystick-"+color, direction);
        // console.log(player + " " + color + " Joystick: " + direction);

        this.resetTimeout();
    }

    resetTimeout() {
        clearTimeout(this.timeout);
        var controlelrs = this.props.controllers;
        this.timeout = setTimeout(function() {
            var controllerOrderString = controlelrs.join("")
            window.location.href = '/?order='+controllerOrderString; 
        }, 1000*60*15)
    }

    componentDidMount() {
        // console.log("gamepad", navigator.getGamepads());
        document.addEventListener("keydown", this.keyboardActionDown, false);
        document.addEventListener("keyup", this.keyboardActionUp, false);
        $("#myControls").focus();
        this.resetTimeout();

        this.ws = new WebSocket('ws://localhost:3002');
        this.commandQueue = [];
        this.isSending = false;

        this.ws.onopen = () => {
            console.log('Connected to the WebSocket');
        };
    
        this.ws.onmessage = (event) => {
            const message = event.data;
            console.log('Message from server:', message);
            this.handleArduinoData(message);
        };
    
        this.ws.onclose = () => {
            console.log('Disconnected from the WebSocket');
        };
    }

    getPinMappings() {
        const pinMappings = {};
        Object.keys(this.keycodes).forEach(key => {
            const control = this.keycodes[key];
            if (control.pin) {
                pinMappings[control.pin] = { ...control, key };
            }
        });
        return pinMappings;
    }

    handleArduinoData(message) {
        const parts = message.split(' '); // ["B67", "1"]
        const pinNumber = parts[0].substring(1); // "67"
        const action = parts[1] == 1 ? "down" : "up"; // "down" or "up"
    
        const pinMappings = this.getPinMappings();

    
        if (pinMappings.hasOwnProperty(pinNumber)) {
            const control = pinMappings[pinNumber];
            if (control.button) {
                this.buttonAction(control.player, control.button, action);
                // if (action == "down") {
                //     this.switchLED(control.player, control.button, true);
                // } else {
                //     this.switchLED(control.player, control.button, false);
                // }

            } else if (control.joystick) {
                if (action == "up") {
                    this.joystickAction(control.player, control.joystick, "up");
                } else {
                    this.joystickAction(control.player, control.joystick, control.direction);
                }
            }
        }
    }

    switchLED(player, button, state, type = "button") {
        Object.keys(this.keycodes).forEach(key => {
            const keycode = this.keycodes[key];
            console.log(keycode)
            if (type == "button") {
                if (keycode.player === player && keycode.button === button && keycode.output_led) {
                    this.sendLEDCommand(keycode.output_led, state);
                }
            } else if (type == "joystick") {
                if (keycode.player === player && keycode.joystick && keycode.joystick == button && keycode.output_led) {
                    this.sendLEDCommand(keycode.output_led, state);
                }
            }
            
        });
    }

    sendLEDCommand(pin, state) {
        // console.log("SEND", pin, state)
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const command = `L${pin.toString().padStart(2, '0')} ${state ? '1' : '0'}`;
            this.commandQueue.push(command);
            this.processQueue();
        } else {
            console.log("WebSocket is not open.");
        }
    }

    resetLEDsCommand() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const command = `L0 0`;
            this.commandQueue.push(command);
            this.processQueue();
        } else {
            console.log("WebSocket is not open.");
        }
    }

    processQueue() {
        if (!this.isSending && this.commandQueue.length > 0) {
            this.isSending = true;
            const command = this.commandQueue.shift();
            this.sendCommand(command);
        }
    }

    sendCommand(command) {
        if (this.ws.readyState === WebSocket.OPEN) {
            // console.log("Sending command", command);
            this.ws.send(command);
            setTimeout(() => {
                this.isSending = false;
                this.processQueue();
            }, 50); // Adjust the delay as needed
        } else {
            console.log("WebSocket is not open.");
            this.isSending = false;
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyboardActionDown, false);
        document.removeEventListener("keyup", this.keyboardActionUp, false);

        if (this.ws) {
            this.ws.close();
        }
    }

    buttonChangeHandler_test(buttonName, down) {
        // console.log(buttonName, down)
    }

    firedArray = [];

    turnOffLEDS() {
        // this.sendLEDCommand(26, false);
        // this.sendLEDCommand(59, false);
        // this.sendLEDCommand(60, false);
        // this.sendLEDCommand(19, false);
        // this.sendLEDCommand(58, false);

        // this.sendLEDCommand(43, false);
        // this.sendLEDCommand(57, false);
        // this.sendLEDCommand(39, false);
        // this.sendLEDCommand(41, false);
        // this.sendLEDCommand(42, false);
    }

    handleKeyDown = (event) => {
        // console.log(event.key)

        if (this.keycodes.hasOwnProperty(event.key)) {
            var keycodeValue = this.keycodes[event.key];
            if (keycodeValue.button) {
                if (this.firedArray.indexOf(keycodeValue.player+' '+keycodeValue.button) === -1) {
                    this.firedArray.push(keycodeValue.player+' '+keycodeValue.button);
                    this.buttonAction(keycodeValue.player, keycodeValue.button, "down");
                }

                // this.switchLED(keycodeValue.player, keycodeValue.button, true);
            } else if (keycodeValue.joystick) {

                
                    this.firedArray.push(keycodeValue.player+' '+keycodeValue.joystick + ' ' + keycodeValue.direction);

                    this.joystickAction(keycodeValue.player, keycodeValue.joystick, keycodeValue.direction)

                
            }
        }
            
        // if(event.key === '1'){
        //     if (this.firedArray.indexOf('P1 Start') === -1) {
        //         this.firedArray.push('P1 Start');
        //         this.buttonAction("P1", "start", "down");
        //     }
        // }
        // if(event.key === '2'){
        //     if (this.firedArray.indexOf('P2 Start') === -1) {
        //         this.firedArray.push('P2 Start');
        //         this.buttonAction("P2", "start", "down");
        //     }
        // }

        // if(event.key === '5'){
        //     if (this.firedArray.indexOf('P3 Coin') === -1) {
        //         this.firedArray.push('P3 Coin');
        //         this.buttonAction("P3", "coin", "down");
        //     }
        // }
    }

    handleKeyUp = (event) => {

        if (this.keycodes.hasOwnProperty(event.key)) {
            var keycodeValue = this.keycodes[event.key];
            if (keycodeValue.button) {
                this.removeA(this.firedArray, keycodeValue.player+' '+keycodeValue.button);
                this.buttonAction(keycodeValue.player, keycodeValue.button, "up");

                if (keycodeValue.player === "P3" && keycodeValue.button === "refresh") {
                    window.location.reload();
                }
                // this.switchLED(keycodeValue.player, keycodeValue.button, false);
            } else if (keycodeValue.joystick) {

                
                this.firedArray.push(keycodeValue.player+' '+keycodeValue.joystick + ' ' + keycodeValue.direction);
    
                this.joystickAction(keycodeValue.player, keycodeValue.joystick, "up")
    
            }
        } 

        // if(event.key === '1'){
        //     this.removeA(this.firedArray, "P1 Start");
        //     this.buttonAction("P1", "start", "up");
        // }
        // if(event.key === '2'){
        //     this.removeA(this.firedArray, "P2 Start");
        //     this.buttonAction("P2", "start", "up");
        // }
        // if(event.key === '3'){
        //     this.removeA(this.firedArray, "P3 Coin");
        //     this.buttonAction("P3", "coin", "up");
        // }
    }

    removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    render() {  



        return (
            <div id='myControls' onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
           {this.props.children}
            </div>
        )
    }    
}

export default Controls;