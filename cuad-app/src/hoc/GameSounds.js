import React, {Component} from 'react';
import $ from 'jquery';

import Sound from 'react-sound';

class GameSounds extends Component {

    handleFinishedPlaying() {
        
    }
    render() {  
        let effect = "sounds/"+this.props.sound+".mp3"
        var sound = <Sound
            url={effect}
            playStatus={Sound.status.PLAYING}
            onFinishedPlaying={this.handleFinishedPlaying}
        />;

        return (
            <div>
            {sound}
            </div>
        )
    }    
}

export default GameSounds;