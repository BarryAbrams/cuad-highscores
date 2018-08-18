import React, {Component} from 'react';
import $ from 'jquery';

class AnimatedGif extends Component {

    componentDidMount() {
       setTimeout(function() {
           $(".animatedgif").addClass("active");
           setTimeout(function() {
                $(".animatedgif").removeClass("active");
           }, 10000);
       }, 100);
    }

    render() {  
      
        return (
            <div className="animatedgif">
               <img alt="cuadventures" src={"/images/cuadventures.gif"} />
            </div>
        )
    }    
}

export default AnimatedGif;