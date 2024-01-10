import React, { Component } from 'react';
import "./App.css";
import Page from './hoc/Layout/Page';

import Controls from "./hoc/Controls";
import {Howl} from 'howler';

class App extends Component {
  state = {
    currentButtonHandler: null,
  };
  controlsRef = React.createRef(); // Create a ref for Controls

  componentDidMount() {
      new Howl({
            src: [ '/sounds/Frogger_Coin.wav']
      });

      new Howl({
        src: [ '/sounds/select.mp3']
              });
        new Howl({
          src: [ '/sounds/start.mp3']
      });
      new Howl({
        src: [ '/sounds/force-hit.mp3']
      });
      new Howl({
        src: [ '/sounds/Tetris.mp3']
      });
    // Initialize and manage Controls WebSocket connection here
    // You can use this.controlsRef.current to access Controls methods
  }

  setCurrentButtonHandler = (handler) => {
    this.setState({ currentButtonHandler: handler });
  };

  buttonHandler = (player, value, action) => {
      if (this.state.currentButtonHandler) {
          this.state.currentButtonHandler(player, value, action);
      }
  };

  render() {
    localStorage.clear();
    return (
      <div>
        <Controls ref={this.controlsRef}  buttonHandler={this.buttonHandler}  
>
          <div class='cache'>
          <img src='https://cuadventures.com//sites/default/files/2018-09/curse-icons.png' />
          <img src='https://cuadventures.com//sites/default/files/2018-09/wizard.png' />
          <img src='https://cuadventures.com//sites/default/files/2019-04/lost-temple.jpg' />
          <img src='https://cuadventures.com//sites/default/files/2019-11/gamenight.png' />
          <img src='https://cuadventures.com//sites/default/files/2019-11/xmastrao.jpg' />
          <img src='https://cuadventures.com//sites/default/files/2023-01/lost-temple.png' />
          <img src='/images/orange-blocks.png' />
          <img src='/images/green-blocks.png' />
          <img src='/images/blue-blocks.png' />
          <img src='/images/red-blocks.png' />
          <img src='/images/yellow-blocks.png' />
          <img src='/images/lightblue-blocks.png' />
          <img src='/images/logoscreen.png' />
          <img src='/images/push-buttons.png' />
          <img src='/images/push-buttons.jpg' />
          <img src='/images/background-blocks.png' />
          <img src='/images/block-overlay.png' />
          <img src='/images/joystick-blue.png' />
          <img src='/images/joystick-green.png' />
          <img src='/images/joystick-red.png' />
          <img src='/images/joystick-storm.png' />
          <img src='/images/joystick-vamp.png' />
          <img src='/images/joystick-yellow.png' />


          </div>
          <Page controls={this.controlsRef.current} setCurrentButtonHandler={this.setCurrentButtonHandler} />
        </Controls>
      </div>
    );
  }
}

export default App;