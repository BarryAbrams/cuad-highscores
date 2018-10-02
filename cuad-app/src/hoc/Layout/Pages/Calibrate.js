import React, {Component} from 'react';
import Gamepad from 'react-gamepad'

class Calibrate extends Component {

    state = {
        stage : 0
    }

    controllerOrder = [];
    connectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} connected !`)
    }
        
    disconnectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} disconnected !`)
    }

    buttonChangeHandler_0(buttonName, down) {
        console.log(buttonName, down)
        if (down) {
            this.registerController(0)
        }
    }

    buttonChangeHandler_1(buttonName, down) {
        console.log(buttonName, down)
        if (down) {
            this.registerController(1)
        }
    }

    buttonChangeHandler_2(buttonName, down) {
        console.log(buttonName, down)
        if (down) {
            this.registerController(2)
        }
    }

    buttonChangeHandler_3(buttonName, down) {
        console.log(buttonName, down)
        if (down) {
            this.registerController(3)
        }
    }

    joystickChangeHandler_0(axisName, value, previousValue) {
        console.log(axisName, value)
    }

    joystickChangeHandler_1(axisName, value, previousValue) {
        console.log(axisName, value)
    }

    joystickChangeHandler_2(axisName, value, previousValue) {
        console.log(axisName, value)
    }

    joystickChangeHandler_3(axisName, value, previousValue) {
        console.log(axisName, value)
    }


    registerController(controllerIndex) {
        // if already in array, show warning
        let valueExistsInArray = false;
        for (var i =0; i<this.controllerOrder.length; i++) {
            if (this.controllerOrder[i] === controllerIndex) {
                valueExistsInArray = true;
            }
        }
        if (!valueExistsInArray) {
            this.controllerOrder.push(controllerIndex);
            this.setState({stage:this.state.stage+1})
        } else {

        }
        
        console.log(this.controllerOrder);
    }

    render() {  
        
        // press player 1 start
        // press player 2 start
        // rotate storm trooper
        // insert coin

        let instructions = "press player 1 start";
        if (this.state.stage == 1) {
            instructions = "press player 2 start"; 
        } else if (this.state.stage == 2) {
            instructions = "wiggle vampire"; 
        } else if (this.state.stage == 3) {
            instructions = "insert coin"; 
        } else if (this.state.stage == 4) {
            instructions = "ALL DONE"; 
            this.props.setGlobalControllerValue(this.controllerOrder);
            this.props.nextAction(2000, "testscreen");
        }
        return (
            <div className="calibrate">
            <Gamepad
            gamepadIndex="0"
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onAxisChange={this.joystickChangeHandler_0.bind(this)}
            onButtonChange={this.buttonChangeHandler_0.bind(this)}
             >
             <div>
                <p>CALIBRATE</p>
                <p className="instructions">{instructions}</p>
             </div>
            </Gamepad>
            <Gamepad
            gamepadIndex="1"
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onAxisChange={this.buttonChangeHandler_1.bind(this)}
            onButtonChange={this.buttonChangeHandler_1.bind(this)}
             ><div /></Gamepad>
            <Gamepad
            gamepadIndex="2"
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onAxisChange={this.buttonChangeHandler_2.bind(this)}
            onButtonChange={this.buttonChangeHandler_2.bind(this)}
             ><div /></Gamepad>
             <Gamepad
            gamepadIndex="3"
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onAxisChange={this.buttonChangeHandler_3.bind(this)}
            onButtonChange={this.buttonChangeHandler_3.bind(this)}
             ><div /></Gamepad>
             </div>
            
        )
    }    
}

export default Calibrate;