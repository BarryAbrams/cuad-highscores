import React, {Component} from 'react';
import axios from '../../../config/axios';

import Moment from 'moment';
import $ from 'jquery';

class Scores extends Component {
    state = {
       scores: null,
    }

    myProps = {
        totalRooms:0,
        currentRoomNum: 0,
    }

    componentDidMount() {
        this.loadData();
       this.currentTimeout = setTimeout(function() {
           this.fadeRoom();
       }.bind(this), 1000)
    }

    componentWillUnmount(){
        clearTimeout(this.currentTimeout);
    }
    
    fadeRoom() {
        $(".room:eq("+this.myProps.currentRoomNum+")").addClass("preactive");

        this.currentTimeout = setTimeout(function() {

        $(".room:eq("+this.myProps.currentRoomNum+")").addClass("active").find(".score").addClass("active");
    
            this.currentTimeout = setTimeout(function() {
                $(".room.active").find(".score.active").removeClass("active");
                this.currentTimeout = setTimeout(function() {
                    $(".room.active").removeClass("active");
                    this.currentTimeout = setTimeout(function() {
                        $(".room.preactive").removeClass("preactive");
                        this.myProps.currentRoomNum++;
                        if (this.myProps.currentRoomNum >= this.myProps.totalRooms) {
                            this.myProps.currentRoomNum = 0;
                            this.props.nextAction(500, "winnersdrugs");
                        } else {
                          this.fadeRoom();
                        }
                    }.bind(this), 1000)
                }.bind(this), 2000)
            }.bind(this), 10000)
        }.bind(this), 50)
    }

    componentDidUpdate(prevProps) {
        this.loadData();
    }
  
    loadData() {
        if ( !this.state.scores ) {
            axios.get("/scores")
            .then (response => {
                
            this.setState({scores: response.data});
            }).catch(error => {
                console.log("can't connect to site");
                console.log(error);
            })
        }
    }

    render() {
        let lastStyle = "right";

        let output = null;
        if (this.state.scores) {
            let icons = null;
      
            let stateScores = [...this.state.scores];
            var storageArray = [];
            stateScores.map((item) => {
                if (!storageArray[item.field_room]) {
                    storageArray[item.field_room] = [];
                }
                let transformedItem = item;
                const roomName = item.field_room;
                delete transformedItem['field_room'];
                var formattedTime = transformedItem['duration'].replace("PT","").replace("H",":").replace("M"," Min ").replace("S"," Sec")
                transformedItem['duration'] = formattedTime;

                var formattedDate = new Date(transformedItem['date']);
                transformedItem['date'] = Moment(formattedDate).fromNow();
                storageArray[roomName].push(transformedItem);
                return null;
            });

            Object.keys(storageArray).map((item) => {
                storageArray[item].length = 5;
                return null;
            })

            this.myProps.totalRooms = Object.keys(storageArray).length;
            

            output = Object.keys(storageArray).map((item) => {
                let count = 0;
                let scores = Object.keys(storageArray[item]).map((scoreitem) => {
                    if (count === 0) {
                        console.log(scores)
                        if (storageArray[item][scoreitem].field_icons) {
                            var url = "https://cuadventures.com/" + storageArray[item][scoreitem].field_icons;
                            icons = <div className="icons"> <img alt={count} src={url} /></div>;
                        }
                    }

                    var scoreObject = storageArray[item][scoreitem];
                    count++;

                 
                    if (lastStyle === "score right") {
                        lastStyle = "score left";
                    } else {
                        lastStyle = "score right";
                    }

                    let noHints = null;
                    if (scoreObject.no_hints === "Yes") {
                        // noHints = (
                        //     <div className="no-hints">
                        //         No Hints!
                        //     </div>
                        // )
                    }

                    let bonusPuzzle = null;
                    if (scoreObject.bonus_puzzle === "True") {
                        // bonusPuzzle = (
                        //     <div className="no-hints">
                        //         Bonus Puzzle!
                        //     </div>
                        // )
                    }

                    return (
                        <li key={scoreObject.team_name} className={lastStyle}>
                            <div className="scoreranking">
                                <span>{count}</span>
                            </div>
                            <div className="details">
                                 <div className="top">
                                    <h4 className="teamname" dangerouslySetInnerHTML={{__html:scoreObject.team_name}}></h4>
                                </div>
                                <div className="container">
                                    <div className="date">
                                        <label>Ran the room</label>
                                        <p dangerouslySetInnerHTML={{__html:scoreObject.date}}></p>
                                    </div>
                                    {/* {noHints} */}
                                    {/* {bonusPuzzle} */}
                                    <div className="duration" >
                                        <label>Completed room in</label>
                                        <p dangerouslySetInnerHTML={{__html:scoreObject.duration}}></p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                });

              
                
                return (
                        <div className="room"  key={item} >
                            <h3 dangerouslySetInnerHTML={{__html:item}}></h3>
                            {icons}
                            <ul>
                            {scores}
                            </ul>
                            {icons}
                        </div>
                    );
            });

            // output = "CONTENT";
        } else {
            output = "";
        }

       

        return (
            <div className="scores" >{output}</div>
        )
    }    
}

export default Scores;