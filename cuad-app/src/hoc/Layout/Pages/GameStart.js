import React, {Component} from 'react';
import $ from 'jquery';
import Controls from "../../Controls";
import {Howl, Howler} from 'howler';

var socket = new WebSocket("ws://localhost:3002/");

class GameStart extends Component {


    buttonDownStart_left = false;
    buttonDownStart_right = false;
    gameTriggerStart = false;
    
    // timerout = null;

    componentDidMount(){
        // document.addEventListener("keydown", this.keyboardActionDown, false);
        // document.addEventListener("keyup", this.keyboardActionUp, false);

        let interval = setInterval(function() {
            if (socket.readyState) {
 
                clearInterval(interval);
                socket.send("P1 Start Button, P2 Start Button");
            }
        }.bind(this), 300)
    }

    componentWillUnmount(){
        // document.removeEventListener("keydown", this.keyboardActionDown, false);
        // document.removeEventListener("keyup", this.keyboardActionUp, false);
    }

    keyboardActionDown = (event) => {
        // #5
        // if(event.keyCode === 49) {
        //     const coinSound = new Howl({
        //         src: [ '/sounds/select.mp3']
        //     });
        //     coinSound.volume(1);
        //     coinSound.play();
        //     this.buttonDownStart_left = true;
        //     if (this.buttonDownStart_right && !this.gameTriggerStart) {
        //          this.startGame();
        //     }
        //     $(".button.left").addClass("pushed");
        // }
        // if(event.keyCode === 50) {
        //     const coinSound = new Howl({
        //         src: [ '/sounds/select.mp3']
        //     });
        //     coinSound.volume(1);
        //     coinSound.play();
        //     this.buttonDownStart_right = true;
        //     if (this.buttonDownStart_left  && !this.gameTriggerStart) {
        //          this.startGame();   
        //     }
        //     $(".button.right").addClass("pushed");
        // }

    }

    keyboardActionUp = (event) => {
        // #5
        if (!this.gameTriggerStart) {
            if(event.keyCode === 49) {
                this.buttonDownStart_left = false;
                $(".button.right").removeClass("pushed");
            }
            if(event.keyCode === 50) {
                this.buttonDownStart_right = false;
                $(".button.left").removeClass("pushed");
            }
        }
    }

    buttonHandler(player, value, action) {
        console.log(player, value, action);
        if (player == "P2" && value == "button-start") {
            
            if (action == "down") {
                const coinSound = new Howl({
                    src: [ '/sounds/select.mp3']
                });
                coinSound.volume(1);
                coinSound.play();
             $(".button.right").addClass("pushed");
             this.buttonDownStart_left = true;
             if (this.buttonDownStart_right && !this.gameTriggerStart) {
                this.startGame();
             }
            } else {
              if (!this.gameTriggerStart) {

              $(".button.right").removeClass("pushed");
                this.buttonDownStart_left = false;
              }
            }
        }

        if (player == "P1" && value == "button-start") {
            
            if (action == "down") {
            const coinSound = new Howl({
                src: [ '/sounds/select.mp3']
            });
            coinSound.volume(1);
            coinSound.play();
             $(".button.left").addClass("pushed");
             this.buttonDownStart_right = true;
             if (this.buttonDownStart_left && !this.gameTriggerStart) {
                this.startGame();
             }
            } else {
              if (!this.gameTriggerStart) {
              $(".button.left").removeClass("pushed");
              this.buttonDownStart_right = false;
              }
            }
        }
    }


    startGame = () => {
        // clearTimeout(this.timerout);
        const coinSound = new Howl({
            src: [ '/sounds/start.mp3']
        });
        coinSound.volume(1);
        coinSound.play();
        this.gameTriggerStart = true;
        console.log("START GAME")
        this.props.startGame();

    }

    render() {
        console.log("game triggered", this.gameTriggerStart)
        let message = <div className="message">LOCATE and PRESS the two start buttons SIMULTANEOUSLY!</div>
        let description = null;
        if (this.props.gameStarted) {
            message = <div className="message">Great job!</div>
            description = <div className="description">Game starting in <span className="number">5</span> seconds.</div>;
            this.countdown = setInterval(function() {
                const coinSound = new Howl({
                    src: [ '/sounds/force-hit.mp3']
                });
                coinSound.volume(1);
                coinSound.play();
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
            <Controls buttonHandler={this.buttonHandler.bind(this)} controllers={this.props.controllers}>

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

            </Controls>
        )
    }    
}

export default GameStart;