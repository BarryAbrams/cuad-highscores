import React, {Component} from 'react';
import {Howl, Howler} from 'howler';
import Controls from '../../Controls';

class Coinage extends Component {
    state = {
        credits: false
    }

    buttonDownCredit = false;
    buttonDownStart_left = false;
    buttonDownStart_right = false;

    // timerout = false;

    // componentDidMount(){
    //     document.addEventListener("keydown", this.keyboardActionDown, false);
    //     document.addEventListener("keyup", this.keyboardActionUp, false);
    // }

    // componentWillUnmount(){
    //     document.removeEventListener("keydown", this.keyboardActionDown, false);
    //     document.removeEventListener("keyup", this.keyboardActionUp, false);
    // }

    buttonHandler(player, value, action) {
        if (!this.props.disableButton) {
            console.log("BUTTON HANDLER", player, value, action)
            if (player == "P3" && value == "button-coin" && action == "down") {
                this.buttonCredit();
                this.props.toggleCoinageOn();
            }
        }
            
    }

    decrementCoin = () => {
        if (this.state.credits) {
            this.setState({credits:false});
        }
    }

    componentWillReceiveProps(props) {
        console.log("recieve PROPS", props)

        if (this.props.disableButton) {
            // alert("here")
            this.setState({credits:false});

        }

        if (this.state.credits) {

            // this.timerout = setTimeout(function() {
            //     this.props.nextAction(10, "restart");
            //     this.setState({credits:false})
            // }.bind(this), 120000);

        } 
        // this.setState({credits:props.coinage});
        // this.setState({ open: props.drawerOpen })
     }

    buttonCredit() {
            this.buttonDownCredit = true;
            const coinSound = new Howl({
            src: [ '/sounds/Frogger_Coin.wav']
            });
            coinSound.volume(1);
            coinSound.play();
            this.setState({credits:true});
            this.props.nextAction(500, "gamestart");
            this.props.toggleCoinageOff();

           
            // clearTimeout(this.timerout);
    }

    render() {

     

        let coinage = (
            <div className="blinking">INSERT COIN</div>
        )
        if (this.props.coinageVisible) {
   
            if (this.state.credits) {
                coinage = (
                    <div> COIN INSERTED! 1 CREDIT </div>
                );
            }
        } else {
            coinage = <div></div>;
        }

        return (
            <Controls buttonHandler={this.buttonHandler.bind(this)} controllers={this.props.controllers}>
            <div className="coinage">
                 {coinage}
            </div>
            </Controls>
        )
    }    
}

export default Coinage;