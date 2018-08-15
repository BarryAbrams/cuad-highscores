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
        nextPiece : null
    }
    debug = true;

    gridSize = 80;


    componentDidMount() {

        if (this.debug) {
            const debugGrid = [[0,0,0,0,0,0,0,0,0,0],
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
                                [0,0,0,0,1,0,0,0,0,0],
                                [0,0,0,0,1,1,0,1,1,1],
                                [0,0,0,0,1,1,0,1,1,1],
                                [0,0,0,1,1,1,0,0,1,1],
                                [0,0,1,1,1,1,1,1,1,1],
                                [1,1,1,0,0,0,1,1,1,1]];
            this.setState({gameGrid:debugGrid})
        }

        this.ticker = setInterval(function() {
            this.gameLoop();
        }.bind(this), 200);
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
        for (var i = 0; i < data.length; i++)
            newData[i] = data[i].slice();
    
        // from now on we make modifications to newData, not data
        var target = newData[x0][y0];
        function flow(x,y) {
            if (x >= 0 && x < newData.length && y >= 0 && y < newData[x].length) {
                if (newData[x][y] === target) {
                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
    
                    newData[x][y] = 9;
                    flow(x-1, y);
                    flow(x+1, y);
                    flow(x, y-1);
                    flow(x, y+1);
                }
            }
        }
        flow(x0,y0);
    
        // shrink array (cut out a square)
        var result = [];
        var count = 0;
        for (var i = minX; i < maxX + 1; i++) {
            result.push( newData[i].slice(minY, maxY + 1) );
            count++;
        }
        return result;
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
                    // console.log(row);


                    this.setState({removingRow:true, theRow:row, removingRowInt:0})
                    // landed.splice(row, 1);
                    // landed.unshift([0,0,0,0,0,0,0,0,0,0]);   
                    
                    // let clump = {};
                    // clump.shape = [];
                    // let count = 0;
                    // for (var row_i = 0; row_i <= row; row_i++) {
                    //     let isFilled_i = false;
                    //     for (var col_i = 0; col_i < landed[row_i].length; col_i++) {
                    //         if (landed[row_i][col_i] != 0) {
                    //             isFilled_i = true;
                    //         } 
                    //     }
                    //     if (isFilled_i) {
                    //         clump.shape[count] = landed[row_i];
                    //         landed[row_i] = [0,0,0,0,0,0,0,0,0,0];
                    //         count++;
                    //     }
                    // }
                    // clump.topLeft = {row:row-clump.shape.length+1,col:0}
                    // this.setState({clump:clump, gameGrid:landed})
                }
            }
        }

        if (this.state.removingRow) {
             clearInterval(this.ticker);
            const row = this.state.theRow;

            if (this.state.removingRowInt === landed[row].length) {
                
                this.setState({removingRow:false, theRow:null, removingRowInt:0})
               
                // figure out seperate clumps
                let clumpCollection = {};
                clumpCollection.shape = [];
                clumpCollection.clumps = [];
                let count = 0;
                for (var row_i = 0; row_i <= row; row_i++) {
                   
                    clumpCollection.shape[count] = landed[row_i];
                    // landed[row_i] = [0,0,0,0,0,0,0,0,0,0];
                    count++;
                    
                }
                // clump.topLeft = {row:row-clump.shape.length+1,col:0}
                console.log(clumpCollection);
                for (var row_y = 0; row_y < clumpCollection.shape.length; row_y++) {
                    console.log()
                    for (var col_x = 0; col_x < clumpCollection.shape[row_y].length; col_x++) {
                        if (clumpCollection.shape[row_y][col_x] != 0) {
                            let clump = {};
                            clump.topLeft = {row:row_y, col:col_x};
                            clump.shape = this.floodFill(clumpCollection.shape, row_y, col_x, 1);
                            console.log("CLIMP", clump);
                            clumpCollection.clumps.push(clump);
                        }
                       
                    }
                }
                
                this.setState({clump:clumpCollection, gameGrid:landed})
                this.ticker = setInterval(function() {
                    this.gameLoop();
                }.bind(this),200);
            } else {
                landed[row][this.state.removingRowInt] = 0;
                this.ticker = setInterval(function() {
                    this.gameLoop();
                }.bind(this), 50);
            }            

            this.setState({removingRowInt:this.state.removingRowInt+1, gameGrid:landed})

            // this.ticker = setInterval(function() {
            //     this.gameLoop();
            // }.bind(this), 200);
            // landed.splice(row, 1);
            // landed.unshift([0,0,0,0,0,0,0,0,0,0]);  
        } else if (this.state.activePiece) {
            // console.log(this.state.activePiece);
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

                this.setState({gameGrid:landed, activePiece:null});
            } else {
                tetromino.topLeft = tetromino.potentialTopLeft;
                this.setState({activePiece : tetromino})
            }
        } else if (this.state.clump) {
            let clumpCollection = this.state.clump;
            let newClumpCollection = [];
            newClumpCollection.clumps = [];
            for (var i = 0; i < clumpCollection.clumps.length; i++) {
                const clump = clumpCollection.clumps[i];

                clump.potentialTopLeft = {row: clump.topLeft.row+1, col:0}

                let collision = null;
                for (var row = 0; row < clump.shape.length; row++) {
                    for (var col = 0; col < clump.shape[row].length; col++) {
                        if (clump.shape[row][col] != 0) {
                            if (row + clump.potentialTopLeft.row >= landed.length) {
                                collision = true;
                            } else if (landed[row + clump.potentialTopLeft.row][col + clump.potentialTopLeft.col] != 0) {
                                collision = true
                            }
                        }
                    }
                }
                if (collision) {
                    for (var row = 0; row < clump.shape.length; row++) {
                        for (var col = 0; col < clump.shape[row].length; col++) {
                            if (clump.shape[row][col] != 0) {
                                // landed[row + clump.topLeft.row][col + clump.topLeft.col] = clump.shape[row][col];
                            }
                        }
                    }
               
                    // this.setState({gameGrid:landed, clump : clumpCollection})

                } else {
                    clump.topLeft = clump.potentialTopLeft;
                    newClumpCollection.clumps.push(clump);
                }
            }

            if (clumpCollection.clumps.length == 0) {
                newClumpCollection = null;
                clearInterval(this.ticker);

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
                for (var row = 0; row < clump.shape.length; row++) {
                    for (var col = 0; col < clump.shape[row].length; col++) {
                        if (clump.shape[row][col] !== 0) {
                            const xPos = col + clump.topLeft.col;
                            const yPos = row + clump.topLeft.row;
                            const style = {
                                left: (xPos * this.gridSize) + 8,
                                top: (yPos * this.gridSize) + 8,
                            }
                            const key = row + " " + col;
                            const colorClass = "piece number_"+clump.shape[row][col];
                            const piece = <div className={colorClass} key={key} style={style} data-pos-x={col} data-pos-y={row}><span></span></div>;
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
                    <p>10 lines</p>
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