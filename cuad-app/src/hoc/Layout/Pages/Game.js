import React, {Component} from 'react';
import $ from 'jquery';

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
    }
    // debug = true;

    gridSize = 80;

    baseSpeed = 400;


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
                                [0,0,0,0,3,1,0,6,5,4],
                                [0,0,0,1,3,1,0,0,7,1],
                                [0,0,1,1,1,1,1,1,1,1],
                                [1,1,1,0,0,0,1,1,1,1]];
            this.setState({gameGrid:debugGrid})
        }

        this.ticker = setInterval(function() {
            this.gameLoop();
        }.bind(this), this.baseSpeed);
        document.addEventListener("keydown", this.keyboardActionDown, false);
        document.addEventListener("keyup", this.keyboardActionUp, false);
    }

    componentWillUnmount() {
        clearInterval(this.ticker);
        document.removeEventListener("keydown", this.keyboardActionDown, false);
        document.removeEventListener("keyup", this.keyboardActionUp, false);
    }

    keyboardActionDown = (event) => {
        // 37 left, 39 right
        if (event.keyCode == 37) {
            this.moveActivePiece(-1);
        }
        if (event.keyCode == 39) {
            this.moveActivePiece(+1);
        }

        if (event.keyCode == 90) {
            this.rotateActivePiece();
        }
    }

    keyboardActionUp = (event) => {
        
    }

    rotateActivePiece () {
        if (this.state.activePiece) {
            let tetromino = this.state.activePiece;
            const landed = this.state.gameGrid;

            let collision = null;
            tetromino.potentialrotationInt = tetromino.rotationInt + 1;
            if (tetromino.potentialrotationInt === 4) {
                tetromino.potentialrotationInt = 0;

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
            tetromino.potentialTopLeft = {row: tetromino.topLeft.row, col:tetromino.topLeft.col+direction}
            const landed = this.state.gameGrid;

            let collision = null;
            for (var row = 0; row < tetromino.shape.length; row++) {
                for (var col = 0; col < tetromino.shape[row].length; col++) {
                    if (tetromino.shape[row][col] != 0) {
                        if (col + tetromino.potentialTopLeft.col < 0 || col + tetromino.potentialTopLeft.col >= landed[0].length) {
                            collision = true;
                        }
                        if (landed[row + tetromino.potentialTopLeft.row][col + tetromino.potentialTopLeft.col] != 0) {
                            collision = true;
                        }
                    }
                }
            }
            if (!collision) {
                tetromino.topLeft = tetromino.potentialTopLeft;
                this.setState({activePiece :tetromino})
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
                if (newData[x][y] == 1 || newData[x][y] == 2  || newData[x][y] == 3 || newData[x][y] == 4 || newData[x][y] == 5 || newData[x][y] == 6 || newData[x][y] == 7)  {
                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
    
                    newData[x][y] =  newData[x][y] + 10;
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

   

        for (var i = minX; i < maxX + 1; i++) {
            shape.push( newData[i].slice(minY, maxY + 1) );
        }

        for (var i=0; i<shape.length; i++) {
            for (var j=0; j<shape[i].length; j++) {
                if (shape[i][j] !== 0) {
                    shape[i][j] = shape[i][j] - 10;
                }
            }
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

    gameLoop() {
        const landed = this.state.gameGrid;

        if (!this.removingRow) {
            for (var row = 0; row < landed.length; row++) {
            let isFilled = true;
                for (var col = 0; col < landed[row].length; col++) {
                    if (landed[row][col] == 0) {
                        isFilled = false;
                    } 
                }
                if (isFilled) {

                    this.setState({removingRow:true, theRow:row, removingRowInt:0})
                
                }
            }
        }

        if (this.state.endGame) {
            if (this.state.removingCol) {
                // landed[this.state.removingColInt] = [0,0,0,0,0,0,0,0,0,0];

                if (this.state.removingColInt == -1) {
                    landed[0] = [0,0,0,0,0,0,0,0,0,0];
                    this.setState({gameGrid:landed, removingCol:true, removingDirection:"down", removingColInt:this.state.removingColInt-1})
                } else if (this.state.removingColInt < -18 && this.state.removingDirection == "down") {
                     clearInterval(this.ticker);
                     this.setState({endGame:false, removingCol:false, removingRowInt:null})
                     setTimeout(function() {
                         this.ticker = setInterval(function() {
                            this.gameLoop();
                         }.bind(this), this.baseSpeed);
                     }.bind(this), 1000)
                } else if(this.state.removingDirection == "up")  {
                    landed[this.state.removingColInt] = [1,1,1,1,1,1,1,1,1,1];
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

            this.setState({removingRowInt:this.state.removingRowInt+1, gameGrid:landed})


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
                    this.setState({gameGrid:landed, endGame:true})
                } else {
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
            this.addNewPiece();
        }
    }

    addNewPiece() {
        console.log("add new piece")
        if (!this.state.nextPiece) {
            this.generateNextPiece();
        }
        let tetromino = this.state.nextPiece;
        tetromino.debutLoop = true;
        this.setState({activePiece:tetromino});
        this.generateNextPiece();
    }

    generateNextPiece() {
        let nextPiece = {};
        nextPiece.rotationInt = 0;
        let randomShape = Math.floor(Math.random() * 7);
        let randomColumn = Math.floor(Math.random() * 7) + 1;

        if (this.debug) {
            randomShape = 1;
            randomColumn = 0;
        }

        randomColumn = 4;

        nextPiece.shapes = this.tetrominoShapes[randomShape];
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
                cols_output.push(<td key={col}><span></span></td>);
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

        return (
            <div className="game">
                <div className="game-header">
                    <div className="controls left">
                    <label>P1 Controls</label>
                    </div>
                    <div className="nextpiece">
                        {nextPiece}
                    </div>
                    <div className="controls right">
                    <label>P2 Controls</label>
                    </div>
                </div>
                <div className="gametable-wrapper">
                    {gameGridTable}
                    {landedPieces}
                    {activePiece}
                    {activeClump}
                </div>
                <div className="game-footer">
                    <label>Score</label>
                    <p>{lines_output}</p>
                </div>
            </div>
        )
    }

    tetrominoShapes = [
        [
            [
                [0,1],
                [0,1],
                [1,1],
            ],
            [
                [1,0,0],
                [1,1,1],
            ],
            [
                [1,1],
                [1,0],
                [1,0],
            ],
            [
                [1,1,1],
                [0,0,1],
            ],
        ],
        [
            [
                [2,0],
                [2,0],
                [2,2],
            ],
            [
                [0,0,2],
                [2,2,2],
            ],
            [
                [2,2],
                [0,2],
                [0,2],
            ],
            [
                [2,2,2],
                [2,0,0],
            ],
        ],
        [
            [
                [3,0],
                [3,3],
                [0,3],
            ],
            [
                [0,3,3],
                [3,3,0],
            ],
            [
                [3,0],
                [3,3],
                [0,3],
            ],
            [
                [0,3,3],
                [3,3,0],
            ],
        ],
        [
            [
                [0,4],
                [4,4],
                [4,0],
            ],
            [
                [4,4,0],
                [0,4,4]
            ],
            [
                [0,4],
                [4,4],
                [4,0],
            ],
            [
                [4,4,0],
                [0,4,4],
            ],
        ],
        [
            [
                [0,5,0],
                [5,5,5],
            ],
            [
                [0,5],
                [5,5],
                [0,5],
            ],
            [
                [5,5,5],
                [0,5,0],
            ],
            [
                [5,0],
                [5,5],
                [5,0],
            ],
        ],
        [
            [
                [0,6,0,0],
                [0,6,0,0],
                [0,6,0,0],
                [0,6,0,0],
            ],
            [
                [0,0,0,0],
                [0,0,0,0],
                [6,6,6,6],
                [0,0,0,0],
            ],
            [
                [0,0,6,0],
                [0,0,6,0],
                [0,0,6,0],
                [0,0,6,0],
            ],
            [
                [0,0,0,0],
                [6,6,6,6],
                [0,0,0,0],
                [0,0,0,0],
            ],
        ],
        [
            [
                [7,7],
                [7,7],
            ],
            [
                [7,7],
                [7,7],
            ],
            [
                [7,7],
                [7,7],
            ],
            [
                [7,7],
                [7,7],
            ],
        ]
    ]
}

export default Game;