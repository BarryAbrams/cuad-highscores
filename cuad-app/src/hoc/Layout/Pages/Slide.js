import React, {Component} from 'react';
import $ from 'jquery';

class Slide extends Component {

    componentDidMount() {
       const duration = this.props.slideInfo.duration * 1000;
       console.log(duration);
       setTimeout(function() {
           $(".animatedgif").addClass("active");
           setTimeout(function() {
                $(".animatedgif").removeClass("active");
           }, duration);
       }, 100);
    }

    render() {  
        console.log(this.props.slideInfo)
        const videoURL = this.props.slideInfo.video + "?autoplay=1&amp;rel=0&amp;controls=0&amp;showinfo=0";
        return (
            <div className="animatedgif">
<iframe width="1080" height="1920" src={videoURL} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>               {/* <img alt="cuadventures" src={"/images/cuadventures.gif"} /> */}
            </div>
        )
    }    
}

export default Slide;