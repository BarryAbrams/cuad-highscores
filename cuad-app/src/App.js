import React, { Component } from 'react';

import Page from './hoc/Layout/Page';

import "./App.css";

class App extends Component {
  render() {
    localStorage.clear()

    return (
      <Page />
    );
  }
}

export default App;