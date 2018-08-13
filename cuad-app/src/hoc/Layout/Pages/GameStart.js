import React, {Component} from 'react';
import $ from 'jquery';

class GameStart extends Component {

    buttonDownStart_left = false;
    buttonDownStart_right = false;
    gameTriggerStart = false;

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
        if(event.keyCode === 49) {
            this.buttonDownStart_left = true;
            if (this.buttonDownStart_right && !this.gameTriggerStart) {
                 this.startGame();
            }
            $(".button.left").addClass("pushed");
        }
        if(event.keyCode === 50) {
            this.buttonDownStart_right = true;
            if (this.buttonDownStart_left  && !this.gameTriggerStart) {
                 this.startGame();   
            }
            $(".button.right").addClass("pushed");
        }

    }

    keyboardActionUp = (event) => {
        // #5
        if (!this.gameTriggerStart) {
            if(event.keyCode === 49) {
                this.buttonDownStart_left = false;
                $(".button.left").removeClass("pushed");
            }
            if(event.keyCode === 50) {
                this.buttonDownStart_right = false;
                $(".button.right").removeClass("pushed");
            }
        }
    }


    startGame = () => {
        this.gameTriggerStart = true;
        console.log("START GAME")
        this.props.startGame();

    }

    render() {
        let message = <div className="message">LOCATE and PRESS the two start buttons SIMULTANEOUSLY!</div>
        let description = null;
        if (this.props.gameStarted) {
            message = <div className="message">Great job!</div>
            description = <div className="description">Game starting in <span className="number">5</span> seconds.</div>;
            this.countdown = setInterval(function() {
                var oldNumber = parseInt($(".gamestart .description .number").text(), 10);
                var newNumber = oldNumber - 1;
                if (newNumber === 0) {
                    clearInterval(this.countdown);
                    $(".gamestart .message").text("Good Luck!");
                    $(".gamestart .description").text("");
                    this.props.nextAction(1000, "game");
                } else {
                    $(".gamestart .description .number").text(newNumber);
                }
            }.bind(this), 1000)
        }
        return (
            <div className="gamestart">
                <div className="header">
                     {message}
                </div>
                <div className="push-buttons">
                    <div className="button-container">
                        <div className="left button">
                        </div>
                        <label>Start Button 1</label>
                    </div>
                    <div className="button-container">
                        <div className="right button">
                        </div>
                        <label>Start Button 2</label>
                    </div>
                </div>
               <div className="footer">
               {description}
                </div>
              
            </div>
        )
    }    
}

export default GameStart;