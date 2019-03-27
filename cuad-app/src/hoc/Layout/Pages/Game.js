import React, {Component} from 'react';
import $ from 'jquery';
import Controls from "../../Controls";
import {Howl, Howler} from 'howler';

var socket = new WebSocket("ws://localhost:3002/");

let p1_heldButtons = [];
let p2_heldButtons = [];

class Game extends Component {

    state = {
        gameGrid : [[0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0]],
        activePiece : null,
        clump : null,
        nextPiece : null,
        endGame : false,
        linesAmt: 0,
        score:0,
        gamepad: 'Not connected. Try pressing a key',
    }
    debug = false;
    droppedItems = 23;

    gridSize = 80;
    hardModeTriggered = false;
    baseSpeed = 500;
    ledOn = false;   

    swapsises = false;

    startOffset = 1;
    backgroundGrid = [  [7, 3, 8, 7, 3, 7, 3, 3, 3, 3],
                        [3, 3, 7, 3, 3, 3, 3, 3, 3, 3],
                        [3, 3, 7, 3, 3, 3, 4, 7, 3, 7],
                        [3, 7, 3, 3, 3, 3, 3, 3, 3, 3],
                        [3, 3, 7, 3, 3, 3, 3, 3, 3, 3],
                        [3, 3, 7, 3, 3, 3, 3, 3, 3, 7],
                        [3, 3, 3, 3, 3, 3, 3, 3, 7, 4],
                        [3, 3, 4, 3, 3, 8, 3, 3, 7, 3],
                        [3, 3, 7, 7, 3, 3, 3, 7, 3, 3],
                        [3, 3, 3, 3, 7, 3, 3, 3, 3, 7],
                        [3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
                        [3, 3, 3, 7, 3, 8, 3, 7, 4, 4],
                        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                        [3, 3, 7, 3, 7, 3, 7, 3, 7, 7],
                        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                        [3, 3, 3, 4, 3, 7, 3, 8, 7, 7],
                        [3, 3, 7, 3, 7, 3, 3, 3, 3, 8],
                        [4, 3, 3, 7, 3, 3, 3, 3, 3, 7]];

    p1_interval = null;
    p2_interval = null;
    newConcept = false;
    componentDidMount() {
        if (this.debug) {
            const debugGrid = [[0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,2,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,0,0,0,0,0,0],
                                [0,0,0,0,2,0,0,0,0,0],
                                [0,0,0,0,2,1,0,1,2,3],
                                [0,0,1,0,3,1,1,6,5,4],
                                [0,0,1,0,3,1,1,2,7,1],
                                [1,0,1,0,1,1,1,1,1,1],
                                [1,1,1,0,1,2,1,1,1,1]];
            this.setState({gameGrid:debugGrid})
        }
        if (this.state.linesAmt >= 5) {
            this.baseSpeed = 400;
        }
        if (this.state.linesAmt >= 10) {
            this.baseSpeed = 300;
        }
        if (this.state.linesAmt >= 15) {
            this.baseSpeed = 200;
        }
        if (this.state.linesAmt >= 20) {
            this.baseSpeed = 100;
        }
        this.ticker = setInterval(function() {
            this.gameLoop();
        }.bind(this), this.baseSpeed);
    }

    componentWillUnmount() {
        clearInterval(this.ticker);
    }
    // buttonChangeHandler(buttonName, down) {
    //     console.log(buttonName, down)
    // }

    connectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} connected !`)
    }
    
    disconnectHandler(gamepadIndex) {
    console.log(`Gamepad ${gamepadIndex} disconnected !`)
    }
    
    buttonChangeHandler(buttonName, down) {
        console.log("BUTTON", buttonName);
        if (buttonName === "A" && down) {
            this.rotateActivePiece(+1);
        }
        if (buttonName === "B" && down) {
            this.rotateActivePiece(-1);
        }
    }
    
    axisChangeHandler(axisName, value, previousValue) {
        if (value === 1) {
            this.moveActivePiece(1);
        }
        if (value === -1) {
            this.moveActivePiece(-1);
        }
    }
    
    buttonDownHandler(buttonName) {
    console.log(buttonName, 'down')
    }
    
    buttonUpHandler(buttonName) {
    console.log(buttonName, 'up')
    }


    triggerHardMode = () => {
        this.props.hardMode();
        clearInterval(this.ticker);
        this.baseSpeed = this.baseSpeed/2;
        this.ticker = setInterval(function() {
            this.gameLoop();
        }.bind(this), this.baseSpeed);
    }

    playSound(effectString) {
        var effectString = "/sounds/"+effectString+".mp3";
        const sound = new Howl({
            src: [effectString]
        });
        sound.volume(1);
        sound.play();
    }

    rotateActivePiece (direction) {
        if (this.state.activePiece) {
            let tetromino = this.state.activePiece;
            const landed = this.state.gameGrid;

            let collision = null;
            tetromino.potentialrotationInt = tetromino.rotationInt + direction;
            if (tetromino.potentialrotationInt === 4) {
                tetromino.potentialrotationInt = 0;
            }

            if (tetromino.potentialrotationInt < 0) {
                tetromino.potentialrotationInt = 3;
            }
            // tetromino.shape = this.jTetromino_rotations[tetromino.rotationInt];

            tetromino.potentialShape = tetromino.shapes[tetromino.potentialrotationInt];

            for (var row = 0; row < tetromino.potentialShape.length; row++) {
                for (var col = 0; col < tetromino.potentialShape[row].length; col++) {
                    if (tetromino.potentialShape[row][col] != 0) {
                        if (col + tetromino.topLeft.col < 0) {
                            collision = true;
                        }
                        if (col + tetromino.topLeft.col >= landed[0].length) {
                            collision = true;
                        }
                        if (row + tetromino.topLeft.row >= landed.length) {
                            collision = true;
                        }
                        if (landed[row + tetromino.topLeft.row][col + tetromino.topLeft.col] != 0) {
                            collision = true;
                        }
                    }
                 }
            }
            this.playSound("whoosh");

            // this.thisSound = null;

            if (!collision) {
                tetromino.rotationInt = tetromino.potentialrotationInt;
                tetromino.shape = tetromino.potentialShape;
                this.setState({activePiece : tetromino})
            }
        }
    }

    moveActivePiece(direction) {
        if (this.state.activePiece) {
            let tetromino = this.state.activePiece;
            if (direction == 0) {
                tetromino.potentialTopLeft = {row: tetromino.topLeft.row + 1, col:tetromino.topLeft.col}
            } else {
                tetromino.potentialTopLeft = {row: tetromino.topLeft.row, col:tetromino.topLeft.col+direction}
            }
            const landed = this.state.gameGrid;

            let collision = null;
            for (var row = 0; row < tetromino.shape.length; row++) {
                for (var col = 0; col < tetromino.shape[row].length; col++) {
                    if (tetromino.shape[row][col] != 0) {
                        if (col + tetromino.potentialTopLeft.col < 0 || col + tetromino.potentialTopLeft.col >= landed[0].length) {
                            collision = true;
                        }
                        if (row + tetromino.potentialTopLeft.row >= landed.length) {
                            collision = true;
                        } else 
                        if (landed[row + tetromino.potentialTopLeft.row][col + tetromino.potentialTopLeft.col] != 0) {
                            collision = true;
                        }
                    }
                }
            }
            if (!collision) {
                tetromino.topLeft = tetromino.potentialTopLeft;
                this.playSound("slow-hit");
                this.setState({activePiece :tetromino})
            } else {
                this.playSound("force-hit");
            }
        }
    }

    floodFill(data, x0, y0) {
        var minX = x0, maxX = x0;
        var minY = y0, maxY = y0;
     
        // perform a deep clone, copying data to newData
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            newData[i] = data[i].slice();
        }
    
        // from now on we make modifications to newData, not data
        var target = newData[x0][y0];

        function flow(x,y) {
            if (x >= 0 && x < newData.length && y >= 0 && y < newData[x].length) {
                if (newData[x][y] === 1 || newData[x][y] === 2  || newData[x][y] === 3 || newData[x][y] === 4 || newData[x][y] === 5 || newData[x][y] === 6 || newData[x][y] === 7 ||
                    newData[x][y] === 11 || newData[x][y] === 12  || newData[x][y] === 13 || newData[x][y] === 14 || newData[x][y] === 15 || newData[x][y] === 16 || newData[x][y] === 17 ||
                    newData[x][y] === 21 || newData[x][y] === 22  || newData[x][y] === 23 || newData[x][y] === 24 || newData[x][y] === 25 || newData[x][y] === 26 || newData[x][y] === 27 ||
                    newData[x][y] === 31 || newData[x][y] === 32  || newData[x][y] === 33 || newData[x][y] === 34 || newData[x][y] === 35 || newData[x][y] === 36 || newData[x][y] === 37 ||
                    newData[x][y] === 41 || newData[x][y] === 42  || newData[x][y] === 43 || newData[x][y] === 44 || newData[x][y] === 45 || newData[x][y] === 46 || newData[x][y] === 47 ||
                    newData[x][y] === 51 || newData[x][y] === 52  || newData[x][y] === 53 || newData[x][y] === 54 || newData[x][y] === 55 || newData[x][y] === 56 || newData[x][y] === 57 ||
                    newData[x][y] === 61 || newData[x][y] === 62  || newData[x][y] === 63 || newData[x][y] === 64 || newData[x][y] === 65 || newData[x][y] === 66 || newData[x][y] === 67 ||
                    newData[x][y] === 71 || newData[x][y] === 72  || newData[x][y] === 73 || newData[x][y] === 74 || newData[x][y] === 75 || newData[x][y] === 76 || newData[x][y] === 77 ||
                    newData[x][y] === 81 || newData[x][y] === 82  || newData[x][y] === 83 || newData[x][y] === 84 || newData[x][y] === 85 || newData[x][y] === 86 || newData[x][y] === 87 ||
                    newData[x][y] === 91 || newData[x][y] === 92  || newData[x][y] === 93 || newData[x][y] === 94 || newData[x][y] === 95 || newData[x][y] === 96 || newData[x][y] === 97 ||
                    newData[x][y] === 101 || newData[x][y] === 102  || newData[x][y] === 103 || newData[x][y] === 104 || newData[x][y] === 105 || newData[x][y] === 106 || newData[x][y] === 107 ||
                    newData[x][y] === 111 || newData[x][y] === 112  || newData[x][y] === 113 || newData[x][y] === 114 || newData[x][y] === 115 || newData[x][y] === 116 || newData[x][y] === 117 ||
                    newData[x][y] === 121 || newData[x][y] === 122  || newData[x][y] === 123 || newData[x][y] === 124 || newData[x][y] === 125 || newData[x][y] === 126 || newData[x][y] === 127 ||
                    newData[x][y] === 131 || newData[x][y] === 132  || newData[x][y] === 133 || newData[x][y] === 134 || newData[x][y] === 135 || newData[x][y] === 136 || newData[x][y] === 137 ||
                    newData[x][y] === 141 || newData[x][y] === 142  || newData[x][y] === 143 || newData[x][y] === 144 || newData[x][y] === 145 || newData[x][y] === 146 || newData[x][y] === 147 ||
                    newData[x][y] === 151 || newData[x][y] === 152  || newData[x][y] === 153 || newData[x][y] === 154 || newData[x][y] === 155 || newData[x][y] === 156 || newData[x][y] === 157) {
                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
    
                    newData[x][y] =  newData[x][y] + 1000;
                    flow(x-1, y);
                    flow(x+1, y);
                    flow(x, y-1);
                    flow(x, y+1);
                }
            }
        }
        flow(x0,y0);
    
        // shrink array (cut out a square)
        var shape = [];

        for (var i=0; i<newData.length; i++) {
            for (var j=0; j<newData[i].length; j++) {
                if (newData[i][j] !== 0) {
                    newData[i][j] = newData[i][j] - 1000;
                }
            }
        }


        for (var i = minX; i < maxX + 1; i++) {
            shape.push( newData[i].slice(minY, maxY + 1) );
        }

     
        var result = [];
        result.shape = shape;
        result.col = minX;
        result.row = minY;
        result.myIndex = minX + "-" + minY + "-" + result.shape.length + "-" + result.shape[0].length;

        return result;
    }

    alreadyInArray(array, index) {
        let exists = false;
        for (var i = 0; i < array.length; i++) {
            if (array[i].index == index) {
                exists = true;
            }
        }

        if (exists) {
            return true;
        } else {
            return false;
        }
    }

     arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }
    
        return true;
    }

    gameLoop() {
        const landed = this.state.gameGrid;

        if (!this.removingRow) {
            if (this.state.theRow == null && this.state.clump == null) {
                let filledRow = [];
                for (var row = 0; row < landed.length; row++) {
                    let isFilled = true;
                    for (var col = 0; col < landed[row].length; col++) {
                        if (landed[row][col] == 0) {
                            isFilled = false;
            
                        } 
                    }
                    
                    if (isFilled) {
                        console.log("testing");

                        filledRow.push(row);
                    }
                    
                }

                if (filledRow.length > 0) {
                    console.log("filled row", filledRow[filledRow.length - 1]);
                    this.setState({removingRow:true, theRow:filledRow[filledRow.length - 1], removingRowInt:0})
                }
            }
            
            
        }



       if (this.state.endGame) {
            if (this.state.removingCol) {
                socket.send("Intro");
                // landed[this.state.removingColInt] = [0,0,0,0,0,0,0,0,0,0];
                this.droppedItems = 0;
                if (this.state.removingColInt == -1) {
                    landed[0] = [0,0,0,0,0,0,0,0,0,0];
                    this.setState({gameGrid:landed, removingCol:true, removingDirection:"down", removingColInt:this.state.removingColInt-1})
                } else if (this.state.removingColInt < -18 && this.state.removingDirection == "down") {
                    $(".changingcontrols .text").text("Game Over");
                    $(".changingcontrols").addClass("active");
                    clearInterval(this.ticker);

                    this.playSound("gameover");
                    this.props.stopMusic();
                    this.setState({endGame:false, removingCol:false, removingRowInt:null})
                     
                     setTimeout(function() {
                         this.baseSpeed = 500;
                         this.ticker = setTimeout(function() {
                            this.state.linesAmt = 0;

                            // this.gameLoop();
                            this.props.nextAction(5000, "winnersdrugs");
                         }.bind(this), 1000);
                     }.bind(this), 1000)
                } else if(this.state.removingDirection == "up")  {
                    landed[this.state.removingColInt] = [1,1,1,1,1,1,1,1,1,1];
                    this.playSound("slow-hit");

                    this.setState({gameGrid:landed, removingCol:true,  removingColInt:this.state.removingColInt-1})
                } else if(this.state.removingDirection == "down")  {
                    landed[Math.abs(this.state.removingColInt +1)] = [0,0,0,0,0,0,0,0,0,0];
                    this.setState({gameGrid:landed, removingCol:true,  removingColInt:this.state.removingColInt-1})
                }

            } else {
                clearInterval(this.ticker);
                this.setState({removingCol:true, removingDirection:"up", removingColInt:landed.length-1, activePiece:null})
                this.ticker = setInterval(function() {

                    this.gameLoop();
                }.bind(this), 50);
            }

        } else if (this.state.removingRow) {
            clearInterval(this.ticker);
            const row = this.state.theRow;
                this.playSound("line-drop");

                console.log("remove this row: " + row)
            // doesn't know what to do with multiple lines at once

            if (this.state.removingRowInt === landed[row].length) {
                
                this.setState({removingRow:false, theRow:null, removingRowInt:0})
               
                // figure out seperate clumps
                let clumpCollection = {};
                clumpCollection.shape = [];
                clumpCollection.clumps = [];
                let count = 0;
                let globalLines = this.state.linesAmt;
                for (var row_i = 0; row_i <= row; row_i++) {
                   
                    clumpCollection.shape[count] = landed[row_i];
                    landed[row_i] = [0,0,0,0,0,0,0,0,0,0];
                    count++;
                }
                globalLines++;
                if (this.state.linesAmt >= 5) {
                    this.baseSpeed = this.baseSpeed * .80;
                }
                if (this.state.linesAmt >= 10) {
                    this.baseSpeed = this.baseSpeed * .80;
                }
                if (this.state.linesAmt >= 15) {
                    this.baseSpeed = this.baseSpeed * .60;
                }
                if (this.state.linesAmt >= 20) {
                    this.baseSpeed = this.baseSpeed * .50;
                }
                // clump.topLeft = {row:row-clump.shape.length+1,col:0}
                for (var row_y = 0; row_y < clumpCollection.shape.length; row_y++) {
                    for (var col_x = 0; col_x < clumpCollection.shape[row_y].length; col_x++) {
                        if (clumpCollection.shape[row_y][col_x] != 0) {
                            let clump = {};
                            var details = this.floodFill(clumpCollection.shape, row_y, col_x);
                            clump.shape = details.shape;
                             clump.rect = {top: details.row, left: details.col,  width:clump.shape[0].length, height:clump.shape.length};
                             clump.topLeft = {row:details.row, col:details.col};
                             clump.index = details.myIndex;

                             if (!this.alreadyInArray(clumpCollection.clumps, clump.index)) {
                                clumpCollection.clumps.push(clump);
                             }
                        }
                    }
                }    

                this.setState({clump:clumpCollection, gameGrid:landed, linesAmt: globalLines})
                
                this.ticker = setInterval(function() {
                    this.gameLoop();
                }.bind(this),this.baseSpeed);
            } else {
                landed[row][this.state.removingRowInt] = 0;
                this.ticker = setInterval(function() {
                    this.gameLoop();
                }.bind(this), 50);
            }            

            this.setState({removingRowInt:this.state.removingRowInt+1, gameGrid:landed, score:this.state.score+10})


        } else if (this.state.activePiece) {
            let tetromino = this.state.activePiece;
            tetromino.potentialTopLeft = {row: tetromino.topLeft.row+1, col:tetromino.topLeft.col}

            let collision = null;
            for (var row = 0; row < tetromino.shape.length; row++) {
                for (var col = 0; col < tetromino.shape[row].length; col++) {
                    if (tetromino.shape[row][col] != 0) {
                        if (row + tetromino.potentialTopLeft.row >= landed.length) {
                            collision = true;
                        } else if (landed[row + tetromino.potentialTopLeft.row][col + tetromino.potentialTopLeft.col] != 0) {
                            collision = true;
                        }

                    }
                 }
            }


            if (collision) {
                for (var row = 0; row < tetromino.shape.length; row++) {
                    for (var col = 0; col < tetromino.shape[row].length; col++) {
                        if (tetromino.shape[row][col] != 0) {
                            landed[row + tetromino.topLeft.row][col + tetromino.topLeft.col] = tetromino.shape[row][col];
                        }
                     }
                }
                if (tetromino.debutLoop) {
                    tetromino.debutLoop = false;
                    this.droppedItems = this.droppedItems + 1;
                    this.setState({gameGrid:landed, endGame:true})
                } else {
                    this.droppedItems = this.droppedItems + 1;
                    this.setState({gameGrid:landed, activePiece:null});
                }
            } else {
                tetromino.topLeft = tetromino.potentialTopLeft;
                this.setState({activePiece : tetromino})
            }

            if (tetromino.debutLoop) {
                tetromino.debutLoop = false;
            }

        } else if (this.state.clump) {

            let clumpCollection = this.state.clump;
            let newClumpCollection = [];
            newClumpCollection.clumps = [];
            for (var i = 0; i < clumpCollection.clumps.length; i++) {
                const clump = clumpCollection.clumps[i];
                clump.potentialTopLeft = {col: clump.topLeft.col + 1, row:clump.topLeft.row}

                let collision = null;
                for (var row = 0; row < clump.shape.length; row++) {
                    for (var col = 0; col < clump.shape[row].length; col++) {
                        if (clump.shape[row][col] != 0) {
                            if (row + clump.potentialTopLeft.col >= landed.length) {
                                collision = true;
                            } else if (landed[row + clump.potentialTopLeft.col][col + clump.potentialTopLeft.row] != 0) {
                                collision = true;
                            }
                        }
                    }
                }
                if (collision) {
                    for (var row = 0; row < clump.shape.length; row++) {
                        for (var col = 0; col < clump.shape[row].length; col++) {
                            if (clump.shape[row][col] != 0) {
                               landed[row+ clump.topLeft.col][col + clump.topLeft.row] = clump.shape[row][col];
                            }
                        }
                    }
               
                } else {
                    clump.topLeft = clump.potentialTopLeft;
                    newClumpCollection.clumps.push(clump);
                }

            }


            if (clumpCollection.clumps.length == 0) {
                newClumpCollection = null;
                // clearInterval(this.ticker);
                this.setState({clump:newClumpCollection, gameGrid:landed})
            } else {
                this.setState({clump:newClumpCollection, gameGrid:landed})
            }

       
        } else {
            if (this.state.changingControls || !this.state.currentControls) {
                let controls = null;
            
                if (this.state.newControls) {
                    controls = this.state.newControls;
                    this.socketControls(controls);
                } else {
                     controls = this.changeControls();

                    this.socketControls(controls);
             
                }
                $(".current-control .control").removeClass("active");
                $(".changingcontrols").addClass("active");
                
                if (this.state.currentControls) {
                    $(".changingcontrols .text").text("Controls are Changing");
                }
                clearInterval(this.ticker);


                if ((this.droppedItems) % 2) {
                    this.swapsises = true;
                } else {
                    this.swapsises = false;
                }
                setTimeout(function() {
                    this.setState({currentControls:controls});
                    setTimeout(function() {
                        $(".current-control .control").addClass("active");

                    }.bind(this), 100);

                    let transitionTime = 500;
                    if (this.newConcept) {
                        transitionTime = 4000;
                        this.newConcept = false;
                    }

                    setTimeout(function() {
                        $(".changingcontrols").removeClass("active");

                        this.setState({changingControls:false})

                        this.ticker = setInterval(function() {
                            this.gameLoop();
                        }.bind(this),this.baseSpeed);
                    }.bind(this), transitionTime);
                }.bind(this), 500);
            } else {
                this.addNewPiece();
            }
        }
    }

    socketControls(controls) {
        console.log("new controls");
        let socketString = "XXXXXXXXXXXXXXXXX";
        if (controls.p1[0] == "joystick-blue") {
            socketString += ", P1 Blue Joystick";
        }

        if (controls.p1[0] == "joystick-red") {
            socketString += ", P1 Red Joystick";
        }

        if (controls.p1[0] == "joystick-green") {
            socketString += ", P1 Green Joystick";
        }

        if (controls.p1[0] == "joystick-yellow") {
            socketString += ", P1 Yellow Joystick";
        }

        if (controls.p1[0] == "joystick-black") {
            socketString += ", P1 Black Joystick";
        }

        if (controls.p1[1] == "button-blue") {
            socketString += ", P1 Blue Button";
        }

        if (controls.p1[1] == "button-red") {
            socketString += ", P1 Red Button";
        }

        if (controls.p1[1] == "button-green") {
            socketString += ", P1 Green Button";
        }

        if (controls.p1[1] == "button-yellow") {
            socketString += ", P1 Yellow Button";
        }

        if (controls.p2[0] == "joystick-blue") {
            socketString += ", P2 Blue Joystick";
        }

        if (controls.p2[0] == "joystick-red") {
            socketString += ", P2 Red Joystick";
        }

        if (controls.p2[0] == "joystick-green") {
            socketString += ", P2 Green Joystick";
        }

        if (controls.p2[0] == "joystick-yellow") {
            socketString += ", P2 Yellow Joystick";
        }

        if (controls.p2[0] == "joystick-black") {
            socketString += ", P2 Black Joystick";
        }

        if (controls.p2[1] == "button-blue") {
            socketString += ", P2 Blue Button";
        }

        if (controls.p2[1] == "button-red") {
            socketString += ", P2 Red Button";
        }

        if (controls.p2[1] == "button-green") {
            socketString += ", P2 Green Button";
        }

        if (controls.p2[1] == "button-yellow") {
            socketString += ", P2 Yellow Button";
        }

    console.log(socketString);
    socket.send(socketString);
    }

    addNewPiece() {
        // if (this.ledOn) {
        //     socket.send("P1 Start Button");
        //     this.ledOn = false;
        // } else {
        //     this.ledOn = true;
        //     socket.send("P2 Start Button"); 
        // }
        console.log("add new piece")
        if (!this.state.nextPiece) {
            this.generateNextPiece();
        }
        let tetromino = this.state.nextPiece;
        tetromino.debutLoop = true;
        let controls = this.changeControls();
        if (!this.arraysEqual(controls.p1, this.state.currentControls.p1) ||
            !this.arraysEqual(controls.p2, this.state.currentControls.p2)) {
                console.log("arrays aren't the same")


            this.setState({activePiece:tetromino, changingControls:true, newControls:controls, score:this.state.score+10});
        } else {
            this.setState({activePiece:tetromino, score:this.state.score+10});

        }
        if ((this.droppedItems) % 2) {
            this.swapsises = true;
        } else {
            this.swapsises = false;
        }
        this.generateNextPiece();
    }

    changeControls() {
        let controls = {p1:["joystick-blue"], p2:["joystick-blue"]};

        let modifier = this.droppedItems + this.startOffset;
        // modifier = Math.floor(Math.random() * 10)

        if (modifier < 3) {

            controls = {p1:["joystick-blue"], p2:["joystick-blue"]}
            // console.log("PART 1", modifier, controls);

        } else if (modifier >= 3 && modifier < 6) {
            if (modifier == 3) {
                this.newConcept = true;
            }
            controls = {p1:["joystick-red"], p2:["joystick-red"]}
            // console.log("PART 2", modifier, controls);
        } else if (modifier >= 6 && modifier < 12) {
            if (modifier == 6) {
                this.newConcept = true;
            }
            let p1_value = ["joystick-blue"];
            let p2_value = ["joystick-red"];

            const modulo = (modifier) % 4;
            // // console.log("MODULO"x, modifier, (modifier) % 2);
            if (modulo < 2) {
                // console.log("switch");
                p1_value = ["joystick-red"];
                p2_value = ["joystick-blue"];
            }
 
            controls = {p1:p1_value, p2:p2_value}
            // console.log("PART 3", modifier, controls, modulo);
        } else if (modifier >= 12 && modifier < 15) {
            if (modifier == 12) {
                this.newConcept = true;
            }
            controls = {p1:["joystick-yellow"], p2:["joystick-green"]}
        } else if (modifier >= 15 && modifier < 18) {
            controls = {p1:["joystick-green"], p2:["joystick-yellow"]}
        } else if (modifier >= 18 && modifier < 23) {
            let p1_value = ["joystick-green"];
            let p2_value = ["joystick-yellow"];

            const modulo = (modifier) % 2;
            // // console.log("MODULO"x, modifier, (modifier) % 2);
            if (modulo == 0) {
                // console.log("switch");
                p1_value = ["joystick-yellow"];
                p2_value = ["joystick-green"];
            }
 
            controls = {p1:p1_value, p2:p2_value}
        } else if (modifier >= 23 && modifier < 28) {
            if (modifier == 23) {
                this.newConcept = true;
            }
            let p1_value = ["joystick-blue", "button-green"];
            let p2_value = ["joystick-red", "button-blue"];

            const modulo = (modifier) % 4;
            // // console.log("MODULO"x, modifier, (modifier) % 2);
            if (modulo == 1) {
                // console.log("switch");
                p1_value = ["joystick-red", "button-blue"];
                p2_value = ["joystick-blue", "button-yellow"];
            }
 
            if (modulo == 2) {
                // console.log("switch");
                p1_value = ["joystick-red", "button-yellow"];
                p2_value = ["joystick-blue", "button-red"];
            }

            if (modulo == 3) {
                // console.log("switch");
                p1_value = ["joystick-blue", "button-red"];
                p2_value = ["joystick-red", "button-green"];
            }

            controls = {p1:p1_value, p2:p2_value}
            // console.log("PART 3", modifier, controls, modulo);
        } else if (modifier >= 28 && modifier < 32) {
            if (modifier == 28) {
                this.newConcept = true;
            }
            let p1_value = ["joystick-blue"];
            let p2_value = ["joystick-black"];

            const modulo = (modifier) % 4;
            // // console.log("MODULO"x, modifier, (modifier) % 2);
            if (modulo == 1) {
                // console.log("switch");
                p1_value = ["joystick-black"];
                p2_value = ["joystick-red"];
            }
 
            if (modulo == 2) {
                // console.log("switch");
                p1_value = ["joystick-red"];
                p2_value = ["joystick-black"];
            }

            if (modulo == 3) {
                // console.log("switch");
                p1_value = ["joystick-black"];
                p2_value = ["joystick-black"];
            }

            controls = {p1:p1_value, p2:p2_value}

        } else if (modifier >= 32) {
            const possibleJoysticks = ["joystick-black", "joystick-blue", "joystick-red", "joystick-green", "joystick-yellow"];
            const possibleButtons = ["button-blue", "button-red", "button-green", "button-yellow"];

            const p1_joystick = possibleJoysticks[Math.floor(Math.random() * possibleJoysticks.length)];
            const p1_button= possibleButtons[Math.floor(Math.random() * possibleButtons.length)];
            
            const p2_joystick = possibleJoysticks[Math.floor(Math.random() * possibleJoysticks.length)];
            const p2_button= possibleButtons[Math.floor(Math.random() * possibleButtons.length)];

            const p1_value = [p1_joystick, p1_button];
            const p2_value = [p2_joystick, p2_button];

            controls = {p1:p1_value, p2:p2_value}
        }

       // console.log("controls", controls);
        
    
       
        return controls;
    }

    calculateShapes(shapeInt, shapes) {
        console.log("CALCULATE SHAPES");
        var shapeTexture_1 = shapeInt + 1 + (Math.floor(Math.random() * 16) * 10);
        var shapeTexture_2 = shapeInt + 1 + (Math.floor(Math.random() * 16) * 10);
        var shapeTexture_3 = shapeInt + 1 + (Math.floor(Math.random() * 16) * 10);
        var shapeTexture_4 = shapeInt + 1 + (Math.floor(Math.random() * 16) * 10);

        console.log("SHAPES:", shapeTexture_1, shapeTexture_2, shapeTexture_3, shapeTexture_4)

        for (var subShape = 0; subShape<shapes.length; subShape++) {
            for (var x = 0; x<shapes[subShape].length; x++) {
                for (var y = 0; y<shapes[subShape][x].length; y++) {
                    if (shapes[subShape][x][y] === 1) {
                        shapes[subShape][x][y] = shapeTexture_1;
                    }

                    if (shapes[subShape][x][y] === 2) {
                        shapes[subShape][x][y] = shapeTexture_2;
                    }

                    if (shapes[subShape][x][y] === 3) {
                        shapes[subShape][x][y] = shapeTexture_3;
                    }

                    if (shapes[subShape][x][y] === 4) {
                        shapes[subShape][x][y] = shapeTexture_4;
                    }

                   
                }
            }
        }

        console.log(shapes);

        return shapes;
    }

    generateNextPiece() {
        let nextPiece = {};
        nextPiece.rotationInt = 0;
        let randomShape = Math.floor(Math.random() * 7);
        let randomColumn = Math.floor(Math.random() * 7) + 1;

        if (this.debug) {
            randomShape = 5;
            randomColumn = 0;
        }

        randomColumn = 4;

        nextPiece.shapes = this.calculateShapes(randomShape, this.tetrominoShapes[randomShape]);
        nextPiece.shape = nextPiece.shapes[nextPiece.rotationInt];
        nextPiece.topLeft = {row: 0, col:randomColumn};
        this.setState({nextPiece:nextPiece});
    }

    prerender_Grid() {
        const gameGridRows = this.state.gameGrid;
        let rows_output = [];
        for (var row = 0; row < gameGridRows.length; row++) {
            let cols_output = [];
            for (var col = 0; col < gameGridRows[row].length; col++) {
                const backgroundColor = this.backgroundGrid[row][col];
                const className = "number_" + backgroundColor;
                cols_output.push(<td key={col} className={className}><span></span></td>);
            }
            rows_output.push(<tr key={row}>{cols_output}</tr>);
        }
        return (
            <table cellSpacing="0" cellPadding="0" border="0" className="gamegridtable">
                <tbody>{rows_output}</tbody>
            </table>
        )
    }

    prerender_LandedPieces() {
        // SET UP THE LANDED PIECES
        const landed = this.state.gameGrid;
        let landed_pieces_output = [];
        for (var row = 0; row < landed.length; row++) {
            for (var col = 0; col < landed[row].length; col++) {
                if (landed[row][col] !== 0){
                    const xPos = col;
                    const yPos = row;
                    const style = {
                        left: (xPos * this.gridSize) + 8,
                        top: (yPos * this.gridSize) + 8,
                    }
                    const key = row + " " + col;
                    const colorClass = "piece landed number_"+landed[row][col];
                    const piece = <div key={key} className={colorClass} style={style} data-pos-x={col} data-pos-y={row}><span></span></div>;
                    landed_pieces_output.push(piece);
                }
            }
        }

        return (
            <div className="landed-pieces">
                {landed_pieces_output}
            </div>
        )
    }

    prerender_ActivePiece() {
        if (this.state.activePiece) {
            const tetromino = this.state.activePiece;
            let active_piece_output = [];
            for (var row = 0; row < tetromino.shape.length; row++) {
                for (var col = 0; col < tetromino.shape[row].length; col++) {
                    if (tetromino.shape[row][col] !== 0) {
                        const xPos = col + tetromino.topLeft.col;
                        const yPos = row + tetromino.topLeft.row;
                        const style = {
                            left: (xPos * this.gridSize) + 8,
                            top: (yPos * this.gridSize) + 8,
                        }
                        const key = row + " " + col;
                        const colorClass = "piece number_"+tetromino.shape[row][col];
                        const piece = <div className={colorClass} key={key} style={style} data-pos-x={col} data-pos-y={row}><span></span></div>;
                        active_piece_output.push(piece);
                    }
                }
            }
            return (
                <div className="active-piece">
                    {active_piece_output}
                </div>
            )
        } else {
            return null;
        }
    }

    prerender_ActiveClump() {
        if (this.state.clump) {
            const clumpCollection = this.state.clump;
            let active_piece_output = [];
            for (var i = 0; i < clumpCollection.clumps.length; i++) {
                const clump = clumpCollection.clumps[i];
                let count = 0;
                for (var row = 0; row < clump.shape.length; row++) {
                    for (var col = 0; col < clump.shape[row].length; col++) {
                        if (clump.shape[row][col] !== 0) {
                            const xPos = col + clump.topLeft.row;
                            const yPos = row + clump.topLeft.col;
                            const style = {
                                left: (xPos * this.gridSize) + 8,
                                top: (yPos * this.gridSize) + 8,
                            }
                            const key = xPos + " " + yPos + count;
                            count++;
                            const colorClass = "piece number_"+clump.shape[row][col];
                            const piece = <div className={colorClass} key={key} style={style} data-pos-x={xPos} data-pos-y={yPos}><span></span></div>;
                            active_piece_output.push(piece);
                        }
                    }
                }
            }
            return (
                <div className="active-clump">
                    {active_piece_output}
                </div>
            )
        } else {
            return null;
        }
        
    }

    prerender_NextPiece() {
        if (this.state.nextPiece) {
            const tetromino = this.state.nextPiece;
            let active_piece_output = [];
            for (var row = 0; row < tetromino.shape.length; row++) {
                for (var col = 0; col < tetromino.shape[row].length; col++) {
                    if (tetromino.shape[row][col] !== 0) {
                        const xPos = col;
                        const yPos = row;
                        const style = {
                            left: (xPos * this.gridSize),
                            top: (yPos * this.gridSize),
                        }
                        const key = row + " " + col;
                        const colorClass = "piece number_"+tetromino.shape[row][col];
                        const piece = <div className={colorClass} key={key} style={style} data-pos-x={col} data-pos-y={row}><span></span></div>;
                        active_piece_output.push(piece);
                    }
                }
            }
            return (
                <div className="active-piece">
                    {active_piece_output}
                </div>
            )
        } else {
            return null;
        }
    }

    prerenderControls (player) {
        if (!this.state.currentControls) {
            return null;
        }
        let controls = null;
        if (player == 1) {
            controls = this.state.currentControls.p1;
        }
        if (player == 2) {
            controls = this.state.currentControls.p2;
        }

        let count = 0;
        const output = controls.map((item, key) => {
            let classes = [item, "control"];
            classes = classes.join(" ");
            const component =<div key={count} className={classes}></div>
            count++;
            return component;
        });
       
        return output;
    }

    prerenderControlsChanging() {
         return <div className="changingcontrols"><div className="text">Get Ready!</div></div>;
    }


    buttonHandler(player, value, action) {
        console.log(player, value, action, this.state.currentControls);

        if (player == "P3" && value == "button-hard") {
            if (!this.hardModeTriggered) {
                this.hardModeTriggered = true;
                this.props.hardMode();
                clearInterval(this.ticker);
                this.baseSpeed = this.baseSpeed/2;
                this.ticker = setInterval(function() {
                    this.gameLoop();
                }.bind(this), this.baseSpeed);
            }
        }

        if (player == "P2") {
            if (value.includes("button-pedal")) {
                if (action == "down") {
                    if (this.p1_interval == null) {
                        this.p2_interval = setInterval(function() {
                            this.moveActivePiece(0);
                        }.bind(this), 100);
                    }
                }

                if (action == "up") {
                    clearInterval(this.p2_interval);
                    this.p2_interval = null;
                }
            }

            if (value.includes("button")) {
                if (action == "down") {
                    // add to array
                    p1_heldButtons.push(value);
                } else {
                    // remove from array
                    var index = p1_heldButtons.indexOf(value);
                    if (index > -1) {
                        p1_heldButtons.splice(index, 1);
                    }
                }
                console.log("held buttons", p1_heldButtons)

            }
            if (this.state.currentControls) {
                if (this.state.currentControls.p1[0] == value) {

                    var buttonNeedsToBeHeld = false;
                    var buttonHeldDown = false;
                    if (this.state.currentControls.p1[1]) {
                        buttonNeedsToBeHeld = true;
                        if (p1_heldButtons.indexOf(this.state.currentControls.p1[1]) > -1) {
                            buttonHeldDown = true;
                        }
                    }
                    if (buttonNeedsToBeHeld == true) {
                        if (buttonHeldDown == true) {
                            if (action === "Right") {
                                if (!this.swapsises) {
                                    this.moveActivePiece(1);
                                } else {
                                    this.rotateActivePiece(1);
                                }
                            }
                            if (action === "Left") {
                                if (!this.swapsises) {
                                    this.moveActivePiece(-1);
                                } else {
                                    this.rotateActivePiece(-1);
                                }
                            }
                        } else {
                            console.log("hold button down");
                        }
                    } else {
                        if (action === "Right") {
                            if (!this.swapsises) {
                                this.moveActivePiece(1);
                            } else {
                                this.rotateActivePiece(1);
                            }
                        }
                        if (action === "Left") {
                            if (!this.swapsises) {
                                this.moveActivePiece(-1);
                            } else {
                                this.rotateActivePiece(-1);
                            }
                        }
                    }
                }
            }
        }

        if (player == "P1") {
            if (value.includes("button-pedal")) {
                if (action == "down") {
                    if (this.p2_interval == null) {
                        this.p1_interval = setInterval(function() {
                            this.moveActivePiece(0);
                        }.bind(this), 100);
                    }
                }

                if (action == "up") {
                    clearInterval(this.p1_interval);
                    this.p1_interval = null;
                }
            }
            if (value.includes("button")) {
                if (action == "down") {
                    // add to array
                    p2_heldButtons.push(value);
                } else {
                    // remove from array
                    var index = p2_heldButtons.indexOf(value);
                    if (index > -1) {
                        p2_heldButtons.splice(index, 1);
                    }
                }
                console.log("held buttons", p2_heldButtons)

            }
            if (this.state.currentControls.p2[0] == value) {

                var buttonNeedsToBeHeld = false;
                var buttonHeldDown = false;
                if (this.state.currentControls.p2[1]) {
                    buttonNeedsToBeHeld = true;
                    if (p2_heldButtons.indexOf(this.state.currentControls.p2[1]) > -1) {
                        buttonHeldDown = true;
                    }
                }
                if (buttonNeedsToBeHeld == true) {
                    if (buttonHeldDown == true) {
                        if (action === "Right") {
                            // this.rotateActivePiece(1);
                            if (!this.swapsises) {
                                this.rotateActivePiece(1);
                            } else {
                                this.moveActivePiece(1);
                            }
                        }
                        if (action === "Left") {
                            if (!this.swapsises) {
                                this.rotateActivePiece(-1);
                            } else {
                                this.moveActivePiece(-1);
                            }
                        }
                    } else {
                        console.log("hold button down");
                    }
                } else {
                    if (action === "Right") {
                        if (!this.swapsises) {
                            this.rotateActivePiece(1);
                        } else {
                            this.moveActivePiece(1);
                        }
                    }
                    if (action === "Left") {
                        if (!this.swapsises) {
                            this.rotateActivePiece(-1);
                        } else {
                            this.moveActivePiece(-1);
                        }
                    }
                }
            }
        }
    }

    finishedPlaying() {
        console.log("finished playing")
        this.thisSound = null;
    }

    playSong = () => {
        this.audio.play();
        this.setState({
            isLoaded: true,
        });
    }
    
    render() {
        // console.log("render")
        let gameGridTable = this.prerender_Grid();
        let landedPieces = this.prerender_LandedPieces();
        let activePiece = this.prerender_ActivePiece();
        let activeClump = this.prerender_ActiveClump();
        let nextPiece = this.prerender_NextPiece();

        let lines_output = "0 Lines";
        if (this.state.linesAmt === 1) {
            lines_output = "1 Line"
        }
        if (this.state.linesAmt > 1) {
            lines_output = this.state.linesAmt + " Lines";
        }

        let score_output = this.state.score;
    

        let p1_controls = this.prerenderControls(1)
        let p2_controls = this.prerenderControls(2)

        let p1_control_label = "MOVE PIECE";
        let p2_control_label = "ROTATE PIECE";

        if (this.swapsises) {
            p1_control_label = "ROTATE PIECE";
            p2_control_label = "MOVE PIECE";
        }

        let controlsChanging = this.prerenderControlsChanging();

        return (
            <div>
            <Controls buttonHandler={this.buttonHandler.bind(this)} controllers={this.props.controllers}>

            <div className="game">
                
                <div className="game-header">
                    <div className="controls left">
                    <label>P1 Controls</label>
                        <div className="current-control">
                        {p2_controls}
                        </div>
                        <div className="control-label">{p2_control_label}</div>
                    </div>
                    <div className="nextpiece">
                        {nextPiece}
                    </div>
                    <div className="controls right">
                    <label>P2 Controls</label>
                        <div className="current-control">
                        {p1_controls}
                        </div>
                        <div className="control-label">{p1_control_label}</div>
                    </div>
                </div>
                <div className="gametable-wrapper">
                    {gameGridTable}
                    {landedPieces}
                    {activePiece}
                    {activeClump}
                    {controlsChanging}
                </div>
                <div className="game-footer">
                    <label>Score</label>
                    {/* <p>{lines_output}</p> */}
                    <p>{score_output} Points</p>
                </div>
            </div>
            </Controls>
            </div>
        )
    }

    tetrominoShapes = [
        [
            [
                [0,1],
                [0,2],
                [4,3],
            ],
            [
                [4,0,0],
                [3,2,1],
            ],
            [
                [3,4],
                [2,0],
                [1,0],
            ],
            [
                [1,2,3],
                [0,0,4],
            ],
        ],
        [
            [
                [1,0],
                [2,0],
                [3,4],
            ],
            [
                [0,0,4],
                [1,2,3],
            ],
            [
                [4,3],
                [0,2],
                [0,1],
            ],
            [
                [3,2,1],
                [4,0,0],
            ],
        ],
        [
            [
                [1,0],
                [2,3],
                [0,4],
            ],
            [
                [0,3,4],
                [1,2,0],
            ],
            [
                [4,0],
                [3,2],
                [0,1],
            ],
            [
                [0,2,1],
                [4,3,0],
            ],
        ],
        [
            [
                [0,1],
                [3,2],
                [4,0],
            ],
            [
                [1,2,0],
                [0,3,4]
            ],
            [
                [0,4],
                [2,3],
                [1,0],
            ],
            [
                [4,3,0],
                [0,2,1],
            ],
        ],
        [
            [
                [0,1,0],
                [2,3,4],
            ],
            [
                [0,4],
                [1,3],
                [0,2],
            ],
            [
                [4,3,2],
                [0,1,0],
            ],
            [
                [2,0],
                [3,1],
                [4,0],
            ],
        ],
        [
            [
                [0,1,0,0],
                [0,2,0,0],
                [0,3,0,0],
                [0,4,0,0],
            ],
            [
                [0,0,0,0],
                [0,0,0,0],
                [1,2,3,4],
                [0,0,0,0],
            ],
            [
                [0,0,4,0],
                [0,0,3,0],
                [0,0,2,0],
                [0,0,1,0],
            ],
            [
                [0,0,0,0],
                [4,3,2,1],
                [0,0,0,0],
                [0,0,0,0],
            ],
        ],
        [
            [
                [1,2],
                [4,3],
            ],
            [
                [4,1],
                [3,2],
            ],
            [
                [3,4],
                [2,1],
            ],
            [
                [2,3],
                [1,4],
            ],
        ]
    ]
}

export default Game;