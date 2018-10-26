import React, {Component} from 'react';
import {Howl, Howler} from 'howler';
import Gamepad from 'react-gamepad'

class Coinage extends Component {
    state = {
        credits: false
    }

    buttonDownCredit = false;
    buttonDownStart_left = false;
    buttonDownStart_right = false;

    timerout = false;

    // componentDidMount(){
    //     document.addEventListener("keydown", this.keyboardActionDown, false);
    //     document.addEventListener("keyup", this.keyboardActionUp, false);
    // }

    // componentWillUnmount(){
    //     document.removeEventListener("keydown", this.keyboardActionDown, false);
    //     document.removeEventListener("keyup", this.keyboardActionUp, false);
    // }

    buttonHandler(player, value, action) {
        console.log(player, value, action);
    }

    keyboardActionDown(event) {
        // #5
        if(event.keyCode === 53 && !this.buttonDownCredit) {
            this.buttonDownCredit = true;
            const coinSound = new Howl({
            src: [ '/sounds/Frogger_Coin.wav']
            });
            coinSound.volume(1);
            coinSound.play();
            this.setState({credits:true});
            this.props.nextAction(500, "gamestart");
        }

        // if(event.keyCode === 49 && !this.buttonDownStart_left) {
        //     this.buttonDownStart_left = true;
        //     if (this.buttonDownStart_right) {
        //         //5this.decrementCoin();   
        //    }
        // }

        // if(event.keyCode === 50 && !this.buttonDownStart_right) {
        //     this.buttonDownStart_right = true;
        //     if (this.buttonDownStart_left) {
        //         //this.decrementCoin();   
        //    }
        // }
    }

    connectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} connected !`)
    }
        
    disconnectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} disconnected !`)
    }

    decrementCoin = () => {
        if (this.state.credits) {
            this.setState({credits:false});
        }
    }
    // keyboardActionUp = (event) => {
    //     // #5
    //     if(event.keyCode === 53) {
    //         this.buttonDownCredit = false;
    //     }

    //     if(event.keyCode === 49) {
    //         this.buttonDownStart_left = false;
    //     }

    //     if(event.keyCode === 50) {
    //         this.buttonDownStart_right = false;
    //     }
    // }

    componentWillReceiveProps(props) {
        console.log("recieve PROPS", props)

        if (!this.state.credits && props.credits) {

            this.timerout = setTimeout(function() {
                this.props.nextAction(1000, "restart");
            }.bind(this), 10000);

        } else {

        }
        // this.setState({credits:props.coinage});
        // this.setState({ open: props.drawerOpen })
     }

    buttonCredit(buttonName, down) {
        if (buttonName == "A" && down) {
            this.buttonDownCredit = true;
            const coinSound = new Howl({
            src: [ '/sounds/Frogger_Coin.wav']
            });
            coinSound.volume(1);
            coinSound.play();
            this.setState({credits:true});
            this.props.nextAction(500, "gamestart");
            clearTimeout(this.timerout);
        }
    }

    render() {

        let coinage = (
            <div className="blinking">INSERT COIN</div>
        )
        if (this.state.credits) {

            coinage = (
                <div> COIN INSERTED! 1 CREDIT </div>
            );
        }
        return (
            <Gamepad
            gamepadIndex={this.props.controller}
            onConnect={this.connectHandler.bind(this)}
            onDisconnect={this.disconnectHandler.bind(this)}
            onButtonChange={this.buttonCredit.bind(this)}
             >
            <div className="coinage" >
                 {coinage}
            </div>
            </Gamepad>
        )
    }    
}

export default Coinage;