import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Glitch.css';
import { randBetween } from './utils/rand.js';

/**
 * Glitches can move upwards, downwards, or in a random manner.
 * These constants define the movement types
 */
const MOVEMENT_TYPES = {
  'RANDOM': 'RANDOM',
  'UP': 'UP',
  'DOWN': 'DOWN'
};

/**
 * Applies a random visual glitch effect to whatever element is behind it
 */
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

  /**
   * Returns a random MOVEMENT_TYPE
   */
  getMovementType() {
    return Object.keys(MOVEMENT_TYPES)[randBetween(0, Object.keys(MOVEMENT_TYPES).length - 1)]
  }

  /**
   * Calls func at an interval, optionally a random interval between time and timeMax
   * 
   * @param func the function to call at the interval
   * @param time the minimum interval in MS
   * @param timeMax optional. the max interval in MS; if omitted, then the interval is set to exactly `time` MS
   */
  addInterval(func, time, timeMax) {
    this.intervals.push(setInterval(func, randBetween(time, timeMax || time)));
  }

  componentDidMount() {
    // Allows glitches to change movement type
    this.addInterval(() => {
      this.setState({
        movementType: this.getMovementType()
      });
    }, 5000, 10000);

    // Allows glitches to move
    this.addInterval(() => {
      let top = this.state.top;

      if (this.state.movementType === MOVEMENT_TYPES.UP) {
        top -= 1;
      } else if (this.state.movementType === MOVEMENT_TYPES.UP) {
        top += 1;
      }

      // Even if the movement type is up or down, still deviate randomly
      // This gives the effect that the movement is generally up or generally down, but still random
      top += randBetween(-1, 1);

      // Allow glitches to wrap; i.e. when they hit the bottom, they reappear at the top
      if (top < 0) {
        top = this.props.height;
      } else if (top > this.props.height) {
        top = 0;
      }

      this.setState({ top });
    }, this.speed);

    // Determine if this is a blinking glitch or not
    if (randBetween(0, 5) > 2) {
      this.addInterval(this.blink.bind(this), 100, 5000);
    }

    // Change the glitch style every once in a while
    this.addInterval(() => {
      this.setState({
        glitchStyle: this.getGlitchStyle()
      });
    }, 3000, 10000);
  }

  componentWillUnmount() {
    // Clean up; unset all the intervals
    this.intervals.forEach(clearInterval);
  }

  /**
   * Hides the glitch and reshows it in 50ms
   */
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

  /**
   * @returns array of Glitch components.
   */
  renderGlitches() {
    let glitches = this.props.numGlitches;
    const els = [];
    while (glitches--) {
      els.push(<Glitch key={glitches} height={this.props.height} />);
    }
    return els;
  }

  /**
   * Renders a random image from picsum.photos, along with a bunch of Glitch elements
   */
  render() {

    const imageSrc = `https://picsum.photos/${this.props.width}/${this.props.height}`;
    return (
      <div className="glitched" >
        <img alt="A random photo, with visual glitch effects applied in CSS" src={imageSrc} />
        {this.renderGlitches()}
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

