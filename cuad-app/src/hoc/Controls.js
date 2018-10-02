import React, {Component} from 'react';
import Gamepad from 'react-gamepad'

class Controls extends Component {

    connectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} connected !`)
    }
        
    disconnectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} disconnected !`)
    }
    
    buttonChangeHandler_player1(buttonName, down) {        
        let buttonColor = null;
        // ABXY
        if (buttonName == "A") {
            buttonColor = "blue";
        }

        if (buttonName == "B") {
            buttonColor = "yellow";
        }

        if (buttonName == "X") {
            buttonColor = "red";
        }

        if (buttonName == "Y") {
            buttonColor = "green";
        }

        if (buttonName == "RS") {
            buttonColor = "start";
        }

        if ( buttonColor) {
            if (down) {
                this.buttonAction("P1", buttonColor, "down");
            } else {
                this.buttonAction("P1", buttonColor, "up");
            }
        }

        
        if (buttonName == "LS") {
            if (down) {
                this.buttonAction("P1", "pedal", "down");
            } else {
                this.buttonAction("P1", "pedal", "up");
            }
        }

        let joystickColor = null;
        let joystickDirection = null;
        if (buttonName == "RB") {
            // Red Left
            joystickColor = "red"
            joystickDirection = "Left"
        }

        if (buttonName == "LB") {
            // Red Right
            joystickColor = "red"
            joystickDirection = "Right"

        }

        if (buttonName == "Start") {
            // Red Left
            joystickColor = "green"
            joystickDirection = "Left"
        }

        if (buttonName == "Back") {
            // Red Right
            joystickColor = "green"
            joystickDirection = "Right"

        }

        if (buttonName == "RT") {
            // Red Left
            joystickColor = "yellow"
            joystickDirection = "Right"
        }

        if (buttonName == "LT") {
            // Red Right
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
            if (value == -1) {
                joystickDirection = "Right"
            }
    
            if (value == 1) {
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
        if (buttonName == "A") {
            buttonColor = "blue";
        }

        if (buttonName == "B") {
            buttonColor = "red";
        }

        if (buttonName == "X") {
            buttonColor = "green";
        }

        if (buttonName == "Y") {
            buttonColor = "yellow";
        }

        if (buttonName == "RS") {
            buttonColor = "start";
        }

        if (buttonColor !== null) {
            if (down) {
                this.buttonAction("P2", buttonColor, "down");
            } else {
                this.buttonAction("P2", buttonColor, "up");
            }
        }

        if (buttonName == "LS") {
            if (down) {
                this.buttonAction("P2", "pedal", "down");
            } else {
                this.buttonAction("P2", "pedal", "up");
            }
        }
        
        let joystickColor = null;
        let joystickDirection = null;
        if (buttonName == "RB") {
            // Red Left
            joystickColor = "red"
            joystickDirection = "Left"
        }

        if (buttonName == "LB") {
            // Red Right
            joystickColor = "red"
            joystickDirection = "Right"

        }

        if (buttonName == "Start") {
            // Red Left
            joystickColor = "green"
            joystickDirection = "Left"
        }

        if (buttonName == "Back") {
            // Red Right
            joystickColor = "green"
            joystickDirection = "Right"

        }

        if (buttonName == "RT") {
            // Red Left
            joystickColor = "yellow"
            joystickDirection = "Left"
        }

        if (buttonName == "LT") {
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
            if (value == -1) {
                joystickDirection = "Left"
            }
    
            if (value == 1) {
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

        if (event.keyCode == 75) {
            this.joystickAction("P2", "black", "Left")
        }
        if (event.keyCode == 76) {
            this.joystickAction("P2", "black", "Right")
        }

        // 73
        // 79

        if (event.keyCode == 73) {
            this.joystickAction("P1", "black", "Left")
        }

        if (event.keyCode == 79) {
            this.joystickAction("P1", "black", "Right")
        }
    }

    buttonChangeHandler_player3(buttonName, down) {
        let player = null;
        let buttonColor = null;
        let joystickDirection = null;
        // ABXY
        if (buttonName == "A") {
            buttonColor = "black";
            player = "P2";
            joystickDirection = "Right";

        }

        if (buttonName == "B") {
            buttonColor = "black";
            player = "P2";
            joystickDirection = "Left";

        }

        if (buttonName == "X") {
            buttonColor = "black";
            player = "P1";
            joystickDirection = "Left";

        }

        if (buttonName == "Y") {
            buttonColor = "black";
            player = "P1";
            joystickDirection = "Right";

        }

        if (player !== null) {
            if (down) {
                this.joystickAction(player, buttonColor, joystickDirection);
            }
        }
    }

    keyboardActionUp = (event) => {

    }

    buttonAction(player, color, action) {
        this.props.buttonHandler(player, "button-"+color, action);
        console.log(player + " Button: " + action);
    }

    joystickAction(player, color, direction) {
        this.props.buttonHandler(player, "joystick-"+color, direction);
        console.log(player + " " + color + " Joystick: " + direction);
    }

    componentDidMount() {
        console.log("gamepad", navigator.getGamepads());
        document.addEventListener("keydown", this.keyboardActionDown, false);
        document.addEventListener("keyup", this.keyboardActionUp, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyboardActionDown, false);
        document.removeEventListener("keyup", this.keyboardActionUp, false);
    }

    buttonChangeHandler_test(buttonName, down) {
        console.log(buttonName, down)
    }

    render() {  
       
        return (
            <div>
            <Gamepad
            gamepadIndex={this.props.controllers[0]}
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onAxisChange={this.axisChangeHandler_player2.bind(this)}
            onButtonChange={this.buttonChangeHandler_player2.bind(this)}
             >{this.props.children}</Gamepad>
            <Gamepad
            gamepadIndex={this.props.controllers[1]}
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onAxisChange={this.axisChangeHandler_player1.bind(this)}
            onButtonChange={this.buttonChangeHandler_player1.bind(this)}
             ><div /></Gamepad>
            <Gamepad
            gamepadIndex={this.props.controllers[2]}
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onButtonChange={this.buttonChangeHandler_player3.bind(this)}
             ><div /></Gamepad>
            
            </div>
        )
    }    
}

export default Controls;