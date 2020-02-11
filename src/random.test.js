const assert = require('assert');
import { randBetween } from './utils/rand.js';

describe('random', function () {
  it('should not return NaN', function () {
    const num = randBetween(0, 100);
    assert(!isNaN(num));
  });
  it('should return type Number', function () {
    const num = randBetween(0, 100);
    assert.equal(typeof num, "number");
  });
  it('should be OK with negative numbers', function () {
    const num = randBetween(-10, 0);
    const lessThanMin = num < -10;
    const moreThanMax = num > 0;
    assert(!lessThanMin, num);
    assert(!moreThanMax, num);
  });
  it('should be OK with min 0 and max 1', function () {
    const num = randBetween(0, 1);
    const lessThanMin = num < 0;
    const moreThanMax = num > 1;
    assert(!lessThanMin, num);
    assert(!moreThanMax, num);
  });
  it('should return a number between 0 and 100, 1000 times', function () {

    let tries = 1000;

    while (tries--) {
      const num = randBetween(0, 100);
      const lessThanMin = num < 0;
      const moreThanMax = num > 100;
      assert(!lessThanMin, num);
      assert(!moreThanMax, num);
    }
  });
  it('should be inclusive of min and max (10,20)', function () {
    let tries = 1000;
    let hadMin = false;
    let hadMax = false;

    while (tries-- && (!hadMin || !hadMax)) {
      const num = randBetween(10, 20);
      hadMin = hadMin || num === 10;
      hadMax = hadMax || num === 20;
    }

    assert(hadMin, 'min');
    assert(hadMax, 'max');
  });
  it('should be OK with range of 1', function () {

    let tries = 100;

    while (tries--) {
      assert(randBetween(42, 42) === 42);
    };
  });
  it('should be approximately evenly distributed', function () {

    let tries = 10000;
    let halves = 0;

    while (tries--) {
      if (randBetween(-10000, 10000) < 0) {
        halves++;
      }
    }
    assert(halves > 4800 && halves < 5200, `saw ${halves}`);
  });
});