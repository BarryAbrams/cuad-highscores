import React, {Component} from 'react';

import TestScreen from "./Pages/TestScreen";
import Scores from "./Pages/Scores";
import WinnersDrugs from "./Pages/WinnersDrugs";
import GameStart from "./Pages/GameStart";
import Game from "./Pages/Game";
import Slide from "./Pages/Slide";
import Calibrate from "./Pages/Calibrate";

import Coinage from "./Elements/Coinage";

import axios from '../../config/axios';
import {Howl, Howler} from 'howler';

var socket = new WebSocket("ws://localhost:3002/");
function setup() {
    socket.onopen = openSocket;
    socket.onmessage = showData;
}
function openSocket() {
    console.log("Socket open");
    socket.send("Hello server");
}

function showData(result) {
    console.log("showData");
}

class Page extends Component {
    state = {
        action : "calibrate",
        gameStarted : false,
        slides:null,
        currentSlide:-1,
    }

    currentSlide = 0;
    musicPlaying = false;
    globalMusic = null;
    controllerOrder = [0, 2, 3, 1];
    changeAction = (delay, newAction) => {
        this.interuptAction();
       
        this.timeout = setTimeout(function() {
            let newSlide = this.state.currentSlide;
            if (newAction == "slide") {
                newSlide = this.state.currentSlide+1;
                if (newSlide >= this.state.slides.length) {
                    newSlide = 0;
                }
                // this.setState({currentSlide:newSlide});
            }
            this.setState({action: newAction, currentSlide:newSlide});
        }.bind(this), delay)
    }

    componentDidMount() {
        this.loadSlideData();
    }

    interuptAction = () => {
        clearTimeout(this.timeout);
    }

    loadSlideData() {
        if ( !this.state.slides ) {
            axios.get("/slides")
            .then (response => {
                
            this.setState({slides:response.data})
            }).catch(error => {
                console.log("can't connect to site");
                console.log(error);
            })
        }
    }
    

    callChildFunction = () => {
        this.child.handleActionParent();  ///calling a child function here
    } 

    startGame = () => {
       this.setState({gameStarted:true});
    }

    stopMusic = () => {
        if (this.globalMusic) {
            this.globalMusic.stop();
            this.globalMusic = null;
            this.musicPlaying = false;
        }
    }

    hardMode = () => {
        if (this.globalMusic) {
            this.globalMusic.stop();
            this.globalMusic = null;
            this.musicPlaying = false;
        }

        this.musicPlaying = true;
        const music = new Howl({
            src: [ '/sounds/21.mp3']
        });
        music.volume(.35);
        music.loop(true);
        music.play();
        this.globalMusic = music;
    }

    setGlobalControllerValue = (data) => {
        this.controllerOrder = data;
        console.log("CONTROLLER ORDER", data);
    }

    render() {
        let page = null;
        let showCoinage = false;
   

        // TEST SCREEN
        // -> LOOP START
        // WINNERS DON'T USE DRUGS
        // HIGH SCORES
        // DEMO MODE
        // AD FOR ROOM (1|2|3)
        // -> LOOP REPEAT
        let music = null;
        if (this.state.action === "calibrate") {
            page = <Calibrate nextAction={this.changeAction} setGlobalControllerValue={this.setGlobalControllerValue} />
            
            let interval = setInterval(function() {
                if (socket.readyState) {
                    clearInterval(interval);
                    // socket.send("Intro");
                }
            }, 300)
            
            // this.changeAction(500, "testscreen")
        }

        if (this.state.action === "testscreen") {
            page = <TestScreen nextAction={this.changeAction} />
            
            let interval = setInterval(function() {
                if (socket.readyState) {
                    clearInterval(interval);
                    // socket.send("P1 Start Button, P2 Start Button");
                    socket.send("Intro");
                }
            }, 300)
            
            this.changeAction(500, "slide")
        }

        if (this.state.action === "winnersdrugs") {
            page = <WinnersDrugs nextAction={this.changeAction} />
            this.changeAction(4100, "slide");
            if (this.state.gameStarted) {
            this.setState({gameStarted:false})
            }
            showCoinage = true;
        }

        if (this.state.action === "slide") {
            const slide = this.state.slides[this.state.currentSlide];
            console.log(slide)
            var totalSlideLength = 0;
            for (var i = 0; i<slide.view.length; i++) {
                totalSlideLength += parseInt(slide.view[i].millis, 10);
            }
            console.log("total Slidle Length", totalSlideLength)
            page = <Slide gif="cuadventures" slideIncrement={this.currentSlide} totalSlideLength={totalSlideLength} slideInfo={slide} nextAction={this.changeAction} />
            this.changeAction(totalSlideLength, "scores");
            
            showCoinage = true;
        }

        if (this.state.action === "scores") {
            page = <Scores nextAction={this.changeAction} />
            showCoinage = true;

            
            // this.changeAction(5000, "testscreen")
        }

        if (this.state.action === "gamestart") {
            page = <GameStart 
            nextAction={this.changeAction} 
            coinAction={this.coinAction}
            gameStarted={this.state.gameStarted}
            startGame={this.startGame}
            controllers={this.controllerOrder}
            />
            if (this.state.gameStarted) {
                showCoinage = false;
                this.coinage = null;
            } else {
                showCoinage = true;

            }
        }

        if (this.state.action === "game") {
            page = <Game nextAction={this.changeAction} controllers={this.controllerOrder} stopMusic={this.stopMusic} hardMode={this.hardMode} playSoundCallback={this.playSound} />
            showCoinage = false;
            this.coinage = null;
            
            if (!this.musicPlaying) {
                this.musicPlaying = true;
                const music = new Howl({
                    src: [ '/sounds/19.mp3']
                });
                music.volume(.25);
                music.loop(true);
                music.play();
                this.globalMusic = music;
           }
        }

        if (showCoinage) {
            this.coinage = <Coinage nextAction={this.changeAction} startGame={this.startGame} controller={this.controllerOrder[3]}/>;
        }
        
        

        return (
            <div className="layout">
                <div className="layout-container">
                {page}
                </div>
                {this.coinage}
            </div>
        )
    }    
}

export default Page;