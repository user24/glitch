import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Glitch.css';
import { randBetween } from './utils/rand.js';

const MOVEMENT_TYPES = {
  'RANDOM': 'RANDOM',
  'UP': 'UP',
  'DOWN': 'DOWN'
};

class Glitch extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      showing: true,
      movementType: this.getMovementType(),
      top: randBetween(0, props.height),
      height: randBetween(0, props.height / 8),
      glitchStyle: this.getGlitchStyle()
    };

    this.intervals = [];

    this.speed = randBetween(1, 10);
  }

  getMovementType() {
    return Object.keys(MOVEMENT_TYPES)[randBetween(0, Object.keys(MOVEMENT_TYPES).length - 1)]
  }

  addInterval(func, time, timeMax) {
    this.intervals.push(setInterval(func, randBetween(time, timeMax || time)));
  }

  componentDidMount() {
    this.addInterval(() => {
      this.setState({
        movementType: this.getMovementType()
      });
    }, 5000, 10000);
    this.addInterval(() => {
      let top = this.state.top;

      if (this.state.movementType === MOVEMENT_TYPES.UP) {
        top -= 1;
      } else if (this.state.movementType === MOVEMENT_TYPES.UP) {
        top += 1;
      }

      top += randBetween(-1, 1);

      if (top < 0) {
        top = this.props.height;
      } else if (top > this.props.height) {
        top = 0;
      }

      this.setState({ top });
    }, this.speed);

    if (randBetween(0, 5) > 2) {
      this.addInterval(this.blink.bind(this), 100, 5000);
    }

    this.addInterval(() => {
      this.setState({
        glitchStyle: this.getGlitchStyle()
      });
    }, 3000, 10000);
  }

  componentWillUnmount() {
    this.intervals.forEach(clearInterval);
  }

  blink() {
    this.setState({ showing: false });
    setTimeout(() => {
      this.setState({ showing: true });
    }, 50);
  }

  getGlitchStyle() {
    const types = [{
      background: "url(https://i.stack.imgur.com/sIIwU.gif)",
      opacity: 0.3
    }, {
      backdropFilter: "invert(1)"
    }, {
      backdropFilter: "blur(10px)"
    }, {
      backdropFilter: "hue-rotate(120deg)"
    }, {
      backdropFilter: "hue-rotate(10deg)"
    }, {
      backdropFilter: "saturate(1.8)"
    }];
    return types[randBetween(0, types.length - 1)];
  }

  getStyles() {
    const styles = {
      display: (this.state.showing) ? "block" : "none",
      height: `${this.state.height}px`,
      top: `${this.state.top}px`,
      left: 0,
      right: 0,
      ...this.state.glitchStyle
    }
    return styles;
  }

  render() {
    const styles = this.getStyles();
    return (<div
      className="glitch"
      style={styles}
    ></div>);
  }
}

Glitch.propTypes = {
  height: PropTypes.number.isRequired,
};


class Glitched extends PureComponent {

  getGlitches() {
    let glitches = this.props.numGlitches;
    const els = [];
    while (glitches--) {
      els.push(<Glitch key={glitches} height={this.props.height} />);
    }
    return els;
  }

  render() {

    const imageSrc = `https://picsum.photos/${this.props.width}/${this.props.height}`;
    return (
      <div className="glitched" >
        <img alt="A random photo, with visual glitch effects applied in CSS" src={imageSrc} />
        {this.getGlitches()}
      </div>
    );
  }
}

Glitched.propTypes = {
  numGlitches: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

Glitched.defaultProps = {
  numGlitches: 10,
  width: 500,
  height: 500
};

export default Glitched;

