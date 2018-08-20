import React, {Component} from 'react';

import TestScreen from "./Pages/TestScreen";
import Scores from "./Pages/Scores";
import WinnersDrugs from "./Pages/WinnersDrugs";
import GameStart from "./Pages/GameStart";
import Game from "./Pages/Game";
import Slide from "./Pages/Slide";

import Coinage from "./Elements/Coinage";

import axios from '../../config/axios';

class Page extends Component {
    state = {
        action : "testscreen",
        gameStarted : false,
        slides:null,
        currentSlide:-1,
    }

    currentSlide = 0;

    changeAction = (delay, newAction) => {
        this.interuptAction();
       
        this.timeout = setTimeout(function() {
            let newSlide = this.state.currentSlide;
            if (newAction == "slide") {
                newSlide = this.state.currentSlide+1;
                if (newSlide > this.state.currentSlide.length) {
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
                
            console.log(response.data);
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

        
        if (this.state.action === "testscreen") {
            page = <TestScreen nextAction={this.changeAction} />
            this.changeAction(500, "winnersdrugs")
        }

        if (this.state.action === "winnersdrugs") {
            page = <WinnersDrugs nextAction={this.changeAction} />
            this.changeAction(4100, "slide");
            showCoinage = true;
        }

        if (this.state.action === "slide") {
            const slide = this.state.slides[this.state.currentSlide];
            page = <Slide gif="cuadventures" slideInfo={slide} nextAction={this.changeAction} />
            this.changeAction(slide.duration * 1000, "scores");
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
            />
            if (this.state.gameStarted) {
                showCoinage = false;
                this.coinage = null;
            } else {
                showCoinage = true;

            }
        }

        if (this.state.action === "game") {
            page = <Game nextAction={this.changeAction}  />
            showCoinage = false;
            this.coinage = null;
        }

        if (showCoinage) {
            console.log("Coinage?" ,this.coinage)      
            this.coinage = <Coinage nextAction={this.changeAction} startGame={this.startGame} />;
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