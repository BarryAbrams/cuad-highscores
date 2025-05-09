import React, {Component} from 'react';

import TestScreen from "./Pages/TestScreen";
// import Scores from "./Pages/Scores";
import Puzzlesaurus from "./Pages/Puzzlesaurus";
import WinnersDrugs from "./Pages/WinnersDrugs";
import GameStart from "./Pages/GameStart";
import Game from "./Pages/Game";
import Slide from "./Pages/Slide";
import Calibrate from "./Pages/Calibrate";
// import Calibrate from "./Pages/Calibrate";

import Coinage from "./Elements/Coinage";

// import axios from '../../config/axios';
import {Howl} from 'howler';

// var socket = new WebSocket("ws://localhost:3002/");
// function setup() {
//     socket.onopen = openSocket;
//     socket.onmessage = showData;
// }
// function openSocket() {
//     console.log("Socket open");
//     socket.send("Hello server");
// }

// function showData(result) {
//     console.log("showData");
// }

class Page extends Component {
    state = {
        action : "testscreen",
        gameStarted : false,
        slides:null,
        currentSlide:-1,
    }

    currentSlide = 0;
    musicPlaying = false;
    globalMusic = null;
    controllerOrder = [0, 2, 3, 1];
    idleTimeout = null;
    globalCoinage = false;
    globalCoinCount = 0;


    changeAction = (delay, newAction) => {
        this.interuptAction();
       
        this.timeout = setTimeout(function() {
            let newSlide = this.state.currentSlide;
            if (newAction === "slide") {
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
            fetch(`${process.env.PUBLIC_URL}/slides.json`)
                 .then(res => {
                   if (!res.ok) throw new Error(`HTTP ${res.status}`);
                   return res.json();
             })
            .then(data => this.setState({ slides: data }))
            .catch(err => console.error("Failed to load slides:", err));
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

    toggleGlobalCoinageOn = () => {
       this.globalCoinage = true; 
    }

    toggleGlobalCoinageOff = () => {
        this.globalCoinage = false;
       
    }

    setGlobalControllerValue = (data) => {
        this.controllerOrder = data;
        console.log("CONTROLLER ORDER", data);
    }

    render() {
        let page = null;
        let showCoinage = false;
        let  buttonDisabled = false;



        // TEST SCREEN
        // -> LOOP START
        // WINNERS DON'T USE DRUGS
        // HIGH SCORES
        // DEMO MODE
        // AD FOR ROOM (1|2|3)
        // -> LOOP REPEAT
        // let music = null;


        // var query = window.location.search.substring(1);
        // var vars = query.split("&");
        // var existingOrder;
        // for (var i=0;i<vars.length;i++) {
        //     // var pair = vars[i].split("=");
        //     // if(pair[0] === "order"){
        //     //     existingOrder = pair[1];
        //     // }
        // }

        // if (existingOrder != null && this.state.action === "calibrate") {
        //     this.controllerOrder = existingOrder.split("").map(Number);
        //     this.setState({action: "testscreen"});
        // }
        
        if (this.state.action === "calibrate") {
            page = <Calibrate 
                nextAction={this.changeAction} 
                setGlobalControllerValue={this.setGlobalControllerValue} 
                controls={this.props.controls}  // Pass controls as a prop
                buttonHandler={this.props.buttonHandler} 
                setCurrentButtonHandler={this.props.setCurrentButtonHandler} 
             />
            
            // let interval = setInterval(function() {
            //     // if (socket.readyState) {
            //     //     clearInterval(interval);
            //     //     // socket.send("Intro");
            //     // }
            // }, 300)
            buttonDisabled = true;

            // this.changeAction(500, "testscreen")
        }

        if (this.state.action === "testscreen") {
            page = <TestScreen nextAction={this.changeAction}                           // Pass controls as a prop
            />
            
            // let interval = setInterval(function() {
            //     // if (socket.readyState) {
            //     //     clearInterval(interval);
            //     //     // socket.send("P1 Start Button, P2 Start Button");
            //     //     socket.send("Intro");
            //     // }
            // }, 300)
            buttonDisabled = true;

            this.changeAction(500, "slide")
        }

        // if (this.state.action === "restart") {
        //     showCoinage = false;
        //     this.coinage = null;
        //     this.changeAction(100, "winnersdrugs");
        // }

        if (this.state.action === "winnersdrugs") {
            console.log("WINNDER DRUGS")
            page = <WinnersDrugs nextAction={this.changeAction} />
            
         
            this.changeAction(4100, "slide");
            
            if (this.state.gameStarted) {
                this.toggleGlobalCoinageOff();
                this.setState({gameStarted:false})
            }
            buttonDisabled = false;

            //this.coinage = null;
            showCoinage = true;
        }

        if (this.state.action === "slide") {
            const slide = this.state.slides[this.state.currentSlide];
            // console.log(slide)
            var totalSlideLength = 0;
            for (var i = 0; i<slide.view.length; i++) {
                totalSlideLength += parseInt(slide.view[i].millis, 10);
            }
            // console.log("total Slidle Length", totalSlideLength)
            page = <Slide gif="cuadventures" slideIncrement={this.currentSlide} totalSlideLength={totalSlideLength} slideInfo={slide} nextAction={this.changeAction} />
            if (this.globalCoinage) {
                this.changeAction(totalSlideLength, "gamestart");
            } else {
                this.changeAction(totalSlideLength, "puzzlesaurus");
            }
            buttonDisabled = false;

            showCoinage = true;
        }

        if (this.state.action === "puzzlesaurus") {
            page = <Puzzlesaurus nextAction={this.changeAction} />
            showCoinage = true;
            buttonDisabled = false;

            this.changeAction(7100, "slide");
        }

        // if (this.state.action === "scores") {
        //     page = <Scores nextAction={this.changeAction} />
        //     showCoinage = true;

        //     buttonDisabled = false;
        //     // this.changeAction(5000, "testscreen")
        // }

        if (this.state.action === "gamestart") {
            page = <GameStart 
            nextAction={this.changeAction} 
            coinAction={this.coinAction}
            gameStarted={this.state.gameStarted}
            startGame={this.startGame}
            controllers={this.controllerOrder}
            controls={this.props.controls} 
            buttonHandler={this.props.buttonHandler} 
            setCurrentButtonHandler={this.props.setCurrentButtonHandler} 
            />
            showCoinage = false;
            buttonDisabled = true;

            // if (this.state.gameStarted) {
            //     showCoinage = false;
            //     this.coinage = null;
            // } else {
            //     showCoinage = true;
            // }

            // this.idleTimeout = setTimeout(function() {
            //     this.changeAction(totalSlideLength, "winnersdrugs");
            // }.bind(this),3000)
        }

        if (this.state.action === "game") {
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout);
            }
            page = <Game 
            nextAction={this.changeAction} 
            controllers={this.controllerOrder} 
            stopMusic={this.stopMusic} 
            hardMode={this.hardMode} 
            playSoundCallback={this.playSound} 
            controls={this.props.controls}  // Pass controls as a prop
            buttonHandler={this.props.buttonHandler} 
            setCurrentButtonHandler={this.props.setCurrentButtonHandler} 
            
            />
            showCoinage = false;
            // this.coinage = null;

            buttonDisabled = true;
            
            if (!this.musicPlaying) {
                this.musicPlaying = true;
                const music = new Howl({
                    src: [ '/sounds/Tetris.mp3']
                });
                music.volume(.25);
                music.loop(true);
                music.play();
                this.globalMusic = music;
           }
        }

        // if (showCoinage) {
            this.coinage = <Coinage 
            nextAction={this.changeAction} 
            toggleCoinageOn={this.toggleGlobalCoinageOn}
            toggleCoinageOff={this.toggleGlobalCoinageOff}
            coinageVisible={showCoinage}
            controllers={this.controllerOrder}
            startGame={this.startGame}
            disableButton={buttonDisabled}
            controller={this.controllerOrder[3]}            
            controls={this.props.controls}  // Pass controls as a prop
            buttonHandler={this.props.buttonHandler} 
            setCurrentButtonHandler={this.props.setCurrentButtonHandler} 
            
            />;
        // }
        
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