import React, {Component} from 'react';
import $ from 'jquery';

class WinnersDrugs extends Component {

    componentDidMount() {
       setTimeout(function() {
           $(".winners-drugs").addClass("active");
           setTimeout(function() {
                $(".winners-drugs").removeClass("active");
           }, 3000);
       }, 100);
    }

    render() {  
      
        return (
            <div className="winners-drugs">
               <img alt="winners don't use drugs" src={"/images/winners_drugs.jpg"} />
            </div>
        )
    }    
}

export default WinnersDrugs;