import React, {Component} from 'react';

import TestScreen from "./Pages/TestScreen";
import Scores from "./Pages/Scores";
import WinnersDrugs from "./Pages/WinnersDrugs";
import GameStart from "./Pages/GameStart";
import Game from "./Pages/Game";
import AnimatedGif from "./Pages/AnimatedGif";

import Coinage from "./Elements/Coinage";

class Page extends Component {
    state = {
        action : "testscreen",
        gameStarted : false,
    }

    changeAction = (delay, newAction) => {
        this.interuptAction();
        this.timeout = setTimeout(function() {
            this.setState({action: newAction});
        }.bind(this), delay)
    }

    interuptAction = () => {
        clearTimeout(this.timeout);
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
            this.changeAction(4100, "cuadventures");
            showCoinage = true;
        }

        if (this.state.action === "cuadventures") {
            page = <AnimatedGif gif="cuadventures" nextAction={this.changeAction} />
            this.changeAction(9000, "scores");
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