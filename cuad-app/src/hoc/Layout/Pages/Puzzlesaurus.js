import React, { Component } from 'react';
import $ from 'jquery';

class Puzzlesaurus extends Component {
  phrases = [
    "Even a Triceratops needs a little help sometimes!",
    "You're roaring through these puzzles!",
    "Don't get stuck in the tar pits—ask for a hint!",
    "Escape Rooms are tough when your hands are hooves!",
    "Keep stomping forward, you're doing great!",
    "Every puzzle solved is a step closer to dino-victory!",
    "Take a brontosaurus-sized breath and think it through!",
    "Even the biggest dinosaurs needed teamwork to survive!",
    "You don't ever need to reach above 6 feet to solve a puzzle!",
  ];

  state = {
    currentSubSlide: 0,
    phrase: '',
    bubbleActive: false
  };

  componentDidMount() {
    // 1) Activate the outer container after 100 ms
    setTimeout(() => {
      $('.puzzlesaurus').addClass('active');
    }, 100);

    // 2) Pick a random phrase immediately
    const randomPhrase = this.phrases[
      Math.floor(Math.random() * this.phrases.length)
    ];
    this.setState({ phrase: randomPhrase });

    // 3) After 1 second, add the `active` class to the bubble
    setTimeout(() => {
      this.setState({ bubbleActive: true });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    // preserve your existing slide‐advance logic
    if (prevState.currentSubSlide === this.state.currentSubSlide) return;

    setTimeout(() => {
      this.setState(({ currentSubSlide }) => ({
        currentSubSlide: currentSubSlide + 1
      }));
    }, 5000);
  }

  render() {
    const { phrase, bubbleActive } = this.state;

    return (
      <div className="animatedgif puzzlesaurus">
        <div className="dinosaur">
          <h3>Puzzlesaurus says:</h3>

          {/* bubble now renders the picked phrase and toggles 'active' */}
          <div
            className={`bubble pixel-border${bubbleActive ? ' active' : ''}`}
          >
            {phrase}
          </div>

          {/* keep your pool hidden in case you need it later */}
          <div className="phrase-pool" style={{ display: 'none' }}>
            {this.phrases.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <img alt="gif" src="images/puzzlesaurus.gif" />
        </div>
      </div>
    );
  }
}

export default Puzzlesaurus;
