import React, {Component} from 'react';
import $ from 'jquery';

class Slide extends Component {

    state = {
        currentSubSlide : 0
    }

    componentDidUpdate() {
        setTimeout(function() {
            this.setState({currentSubSlide:this.state.currentSubSlide + 1})
        }.bind(this), this.props.slideInfo.view[this.state.currentSubSlide].millis);
    }

    componentDidMount() {
    //    const duration = this.props.slideInfo.duration * 1000;
    //    console.log(duration);
       setTimeout(function() {
           $(".animatedgif").addClass("active");
           setTimeout(function() {
                this.setState({currentSubSlide: 1})
           }.bind(this), this.props.slideInfo.view[0].millis);
           setTimeout(function() {
            $(".animatedgif").removeClass("active");
            }, this.props.totalSlideLength-500);
        //    setTimeout(function() {
        //         $(".animatedgif").removeClass("active");
        //    }, duration);
       }.bind(this), 100);
    }

    render() {
        
        var subslide = this.props.slideInfo.view[this.state.currentSubSlide].image;
        
        subslide = "https://cuadventures.com/" + subslide;
        return (
            <div className="animatedgif">
                <div><img alt="gif" src={subslide} /></div>
            </div>
        )
    }    
}

export default Slide;