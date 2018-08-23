import React, { Component } from 'react';
import "./App.css";
import Page from './hoc/Layout/Page';


class App extends Component {

  render() {
    localStorage.clear()
    return (
      <div>

      <Page />
      </div>
    );
  }
}

export default App;