import React, {Component} from 'react';
import Gamepad from 'react-gamepad'
import $ from 'jquery';

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
        console.log(buttonName, down)
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

        if (buttonName == "LB") {
            if (down) {
                this.buttonAction("P3", "hard", "down");
            }
        }
    }

    buttonChangeHandler_player4(buttonName, down) {
        console.log(buttonName, down)

        if (buttonName == "B") {
            if (down) {
                this.buttonAction("P3", "hard", "down");
            }
        }

        if (buttonName == "A") {
            if (down) {
                this.buttonAction("P3", "coin", "down");
            }
        }
        // let player = null;
        // let buttonColor = null;
        // let joystickDirection = null;
        // // ABXY
        // if (buttonName == "A") {
        //     buttonColor = "black";
        //     player = "P2";
        //     joystickDirection = "Right";

        // }

        // if (buttonName == "B") {
        //     buttonColor = "black";
        //     player = "P2";
        //     joystickDirection = "Left";

        // }

        // if (buttonName == "X") {
        //     buttonColor = "black";
        //     player = "P1";
        //     joystickDirection = "Left";

        // }

        // if (buttonName == "Y") {
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
        $("#myControls").focus();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyboardActionDown, false);
        document.removeEventListener("keyup", this.keyboardActionUp, false);
    }

    buttonChangeHandler_test(buttonName, down) {
        console.log(buttonName, down)
    }

    firedArray = [];

    handleKeyDown = (event) => {
        console.log(event.key)
            
        if(event.key == '1'){
            if (this.firedArray.indexOf('P1 Start') == -1) {
                this.firedArray.push('P1 Start');
                this.buttonAction("P1", "start", "down");
            }
        }
        if(event.key == '2'){
            if (this.firedArray.indexOf('P2 Start') == -1) {
                this.firedArray.push('P2 Start');
                this.buttonAction("P2", "start", "down");
            }
        }

        if(event.key == '5'){
            if (this.firedArray.indexOf('P3 Coin') == -1) {
                this.firedArray.push('P3 Coin');
                this.buttonAction("P3", "coin", "down");
            }
        }
    }

    handleKeyUp = (event) => {
        if(event.key == '1'){
            this.removeA(this.firedArray, "P1 Start");
            this.buttonAction("P1", "start", "up");
        }
        if(event.key == '2'){
            this.removeA(this.firedArray, "P2 Start");
            this.buttonAction("P2", "start", "up");
        }
        if(event.key == '3'){
            this.removeA(this.firedArray, "P3 Coin");
            this.buttonAction("P3", "coin", "up");
        }
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
            <div id='myControls' onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabindex="0">
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
            <Gamepad
            gamepadIndex={this.props.controllers[3]}
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onButtonChange={this.buttonChangeHandler_player4.bind(this)}
             ><div /></Gamepad>
            </div>
        )
    }    
}

export default Controls;