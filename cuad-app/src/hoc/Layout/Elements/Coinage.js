import React, {Component} from 'react';

class Coinage extends Component {
    state = {
        credits: 0
    }

    buttonDownCredit = false;
    buttonDownStart_left = false;
    buttonDownStart_right = false;

    componentDidMount(){
        document.addEventListener("keydown", this.keyboardActionDown, false);
        document.addEventListener("keyup", this.keyboardActionUp, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyboardActionDown, false);
        document.removeEventListener("keyup", this.keyboardActionUp, false);
    }

    keyboardActionDown = (event) => {
        // #5
        if(event.keyCode === 53 && !this.buttonDownCredit) {
            this.buttonDownCredit = true;
            this.setState({credits:this.state.credits+1});
            this.props.nextAction(500, "gamestart");
        }

        if(event.keyCode === 49 && !this.buttonDownStart_left) {
            this.buttonDownStart_left = true;
            if (this.buttonDownStart_right) {
                this.decrementCoin();   
           }
        }

        if(event.keyCode === 50 && !this.buttonDownStart_right) {
            this.buttonDownStart_right = true;
            if (this.buttonDownStart_left) {
                this.decrementCoin();   
           }
        }
    }


    decrementCoin = () => {
        if (this.state.credits > 0) {
            this.setState({credits:this.state.credits-1});
        }
    }
    keyboardActionUp = (event) => {
        // #5
        if(event.keyCode === 53) {
            this.buttonDownCredit = false;
        }

        if(event.keyCode === 49) {
            this.buttonDownStart_left = false;
        }

        if(event.keyCode === 50) {
            this.buttonDownStart_right = false;
        }
    }

    componentWillReceiveProps(props) {
        console.log("recieve PROPS", props)
        // this.setState({credits:props.coinage});
        // this.setState({ open: props.drawerOpen })
     }
  
    render() {
        let coinage = (
            <div className="blinking">INSERT COIN</div>
        )
        if (this.state.credits > 0) {
            coinage = (
                <div> {this.state.credits} CREDIT(S) </div>
            );
        }
        return (
            <div className="coinage">
                 {coinage}
            </div>
        )
    }    
}

export default Coinage;