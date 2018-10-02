import React, {Component} from 'react';
import {Howl, Howler} from 'howler';

class Coinage extends Component {
    
    state = {
        sounds : []
    }

    playSound(effectString, id) {

        // const soundURL = "/sounds/"+effectString+".mp3"

        // const sound = new Howl({
        //     src: ['/sounds/music.mp3']
        // });
        // sound.play();
       
    }

    soundEnded(target) {
        console.log("sound ended", target)
    }

    componentWillReceiveProps(props) {

    }
  
    render() {
      
        return (
            <div className="sound">
                SOUND
            </div>
        )
    }    
}

export default Coinage;