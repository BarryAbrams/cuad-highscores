import React, { Component } from 'react';
import "./App.css";
import Page from './hoc/Layout/Page';

import Controls from "./hoc/Controls";

class App extends Component {
  state = {
    currentButtonHandler: null,
  };
  controlsRef = React.createRef(); // Create a ref for Controls

  componentDidMount() {
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
          <Page controls={this.controlsRef.current} setCurrentButtonHandler={this.setCurrentButtonHandler} />
        </Controls>
      </div>
    );
  }
}

export default App;