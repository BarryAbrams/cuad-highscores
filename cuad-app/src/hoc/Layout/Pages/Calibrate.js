import React, {Component} from 'react';
// import Controls from '../../Controls';

function toCamelCase(str) {
    return str
        .split('-')
        .map((word, index) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

class Calibrate extends Component {
    state = {
        stage : 0,
        lastInput: '',
        inputs: {

        },
    }

    constructor(props) {
        super(props);

        // Bind the localButtonHandler
        this.localHandler = this.localHandler.bind(this);
    }

    controllerOrder = [];

    // constructor(props) {
    //     super(props);
    //     this.controlsRef = React.createRef(); // Creating a ref
    // }

    componentDidMount(){
        this.props.setCurrentButtonHandler(this.localHandler);
    }

    componentWillUnmount(){
        this.props.setCurrentButtonHandler(this.localHandler);
    }

    connectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} connected !`)
    }
        
    disconnectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} disconnected !`)
    }

    callControlFunction = (player, buttonName, down) => {
        const modifiedButtonName = buttonName.replace("button-", "");
        if (this.props.controls) {
            console.log("LED", player, modifiedButtonName, down)

            if (down == "down") {
                this.props.controls.switchLED(player, modifiedButtonName, true); // Calling the function

            } else {
                this.props.controls.switchLED(player, modifiedButtonName, false); // Calling the function

            }

        }
    }  

    localHandler(player, buttonName, down) {
        const camelCaseButtonName = toCamelCase(buttonName);
        this.setState({ lastInput: `${player}: Button ${camelCaseButtonName} ${down}` }); // Update the state
        
        this.callControlFunction(player, buttonName, down);
      

        var value = false;
        if (down === "down") {
            value = true;
        }

        if (buttonName.includes("joystick")) {
            value = true;

            this.setState(prevState => ({
                inputs: {
                    ...prevState.inputs,
                    [`${player}_${camelCaseButtonName}`]: down
                }
            }));
        } else {
            this.setState(prevState => ({
                inputs: {
                    ...prevState.inputs,
                    [`${player}_${camelCaseButtonName}`]: value
                }
            }));
        }



        console.log(this.state)
    }

    handleKeyPress = (event) => {
        if(event.key === 's'){
            this.controllerOrder.push(9);
            this.setState({stage:this.state.stage+1})
        }
    }

    renderInputTable() {
        const { inputs } = this.state;
        return (
            <div className="calibrate" onKeyDown={this.handleKeyPress} tabIndex="0">
                <div className='controls'>
    
                    <div>
                        <h3>Window:</h3>
                        <table>
                        <tbody>
                                <tr>
                                <td><div className={`joystick blue ${inputs.P1_JoystickBlue}`}></div></td>
                                <td><div className={`joystick red ${inputs.P1_JoystickRed}`}></div></td>
                                </tr>
                                <tr>
                                <td><div className={`joystick green ${inputs.P1_JoystickGreen}`}></div></td>

                                <td><div className={`joystick yellow ${inputs.P1_JoystickYellow}`}></div></td>
                                </tr>
                            </tbody>
                        </table>
        
                        <br/>

                        <div className={inputs.P1_ButtonStart ? 'highlight' : ''}>
                            <div className='button start'></div>
                        </div>

                        <div className='buttons'> 
                            <div className={inputs.P1_ButtonBlue ? 'highlight' : ''}><div className='button blue'></div></div>
                            <div className={inputs.P1_ButtonRed ? 'highlight' : ''}><div className='button red'></div></div>
                            <div className={inputs.P1_ButtonGreen ? 'highlight' : ''}><div className='button green'></div></div>
                            <div className={inputs.P1_ButtonYellow ? 'highlight' : ''}><div className='button yellow'></div></div>
                        </div>

                        <div className='buttons'> 
                            <div className={inputs.P1_ButtonPedal ? 'highlight' : ''}><div className='button pedal'></div></div>
                        </div>

                        <div className='buttons'> 
                            <div className={`joystick black ${inputs.P1_JoystickBlack}`}></div>
                        </div>
                    </div>

                    <div>
                        <h3>Hallway:</h3>
                        <table>
                        <tbody>
                                <tr>
                                <td><div className={`joystick blue ${inputs.P2_JoystickBlue}`}></div></td>
                                <td><div className={`joystick red ${inputs.P2_JoystickRed}`}></div></td>
                                </tr>
                                <tr>
                                <td><div className={`joystick green ${inputs.P2_JoystickGreen}`}></div></td>
                                <td><div className={`joystick yellow ${inputs.P2_JoystickYellow}`}></div></td>
                                </tr>
                            </tbody>
                        </table>
        
                        <br/>

                        <div className={inputs.P2_ButtonStart ? 'highlight' : ''}>
                            <div className='button start'></div>
                        </div>

                        <div className='buttons'> 
                            <div className={inputs.P2_ButtonBlue ? 'highlight' : ''}><div className='button blue'></div></div>
                            <div className={inputs.P2_ButtonRed ? 'highlight' : ''}><div className='button red'></div></div>
                            <div className={inputs.P2_ButtonGreen ? 'highlight' : ''}><div className='button green'></div></div>
                            <div className={inputs.P2_ButtonYellow ? 'highlight' : ''}><div className='button yellow'></div></div>
                        </div>

                        <div className='buttons'> 
                            <div className={inputs.P2_ButtonPedal ? 'highlight' : ''}><div className='button pedal'></div></div>
                        </div>

                        <div className='buttons'> 
                            <div className={`joystick black ${inputs.P2_JoystickBlack}`}></div>
                        </div>

                        <br/>
                    </div>

                </div>
            </div>
        );
    }

    render() {  
    
        return (
            <div>
            {/* <Controls ref={this.controlsRef} buttonHandler={this.buttonHandler.bind(this)} controllers={this.props.controllers}> */}

              
                <div className="calibrate" onKeyDown={this.handleKeyPress} tabIndex="0">
                    <div>
                        {this.renderInputTable()} {/* Render the input table */}

                        <p className="instructions"> Last: { this.state.lastInput } </p>
                       
                    
                    </div>
                </div>
            {/* </Controls> */}
             

             </div>
        )
    }    
}

export default Calibrate;