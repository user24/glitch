const assert = require('assert');
import { randBetween } from './utils/rand.js';

describe('random', function () {
  it('should not return NaN', function () {
    const r = randBetween(0, 100);
    assert(!isNaN(r));
  });
  it('should return type number', function () {
    const r = randBetween(0, 100);
    assert.equal(typeof r, "number");
  });
  it('should be OK with min > max', function () {

    let tries = 1000;

    while (tries--) {
      const r = randBetween(100, 0);
      const lessThanMin = r < 0;
      const moreThanMax = r > 100;
      assert(!lessThanMin, r);
      assert(!moreThanMax, r);
    }
  });
  it('should be OK with decimals', function () {
    const min = 0.1;
    const max = 0.4;
    const r = randBetween(min, max);
    assert(r >= min, r);
    assert(r <= max, r);
  });
  it('should be able to request decimals with whole bounds', function () {
    const min = 1;
    const max = 2;
    let tries = 100;

    let seenDecimal = false;
    let r;
    while (tries--) {
      r = randBetween(min, max, true);
      if (parseInt(r) !== r) {
        seenDecimal = true;
        break;
      }
    }
    assert(seenDecimal, `min:${min}, max:${max}, r:${r}, tries:${99 - tries}`);
  });
  it('should be OK with negative numbers', function () {
    const r = randBetween(-10, 0);
    const lessThanMin = r < -10;
    const moreThanMax = r > 0;
    assert(!lessThanMin, r);
    assert(!moreThanMax, r);
  });
  it('should be OK with min 0 and max 1', function () {
    const r = randBetween(0, 1);
    const lessThanMin = r < 0;
    const moreThanMax = r > 1;
    assert(!lessThanMin, r);
    assert(!moreThanMax, r);
  });
  it('should return a number between 0 and 100, 1000 times', function () {

    let tries = 1000;

    while (tries--) {
      const r = randBetween(0, 100);
      const lessThanMin = r < 0;
      const moreThanMax = r > 100;
      assert(!lessThanMin, r);
      assert(!moreThanMax, r);
    }
  });
  it('should be inclusive of min and max (10,20)', function () {
    let tries = 1000;
    let hadMin = false;
    let hadMax = false;

    while (tries-- && (!hadMin || !hadMax)) {
      const r = randBetween(10, 20);
      hadMin = hadMin || r === 10;
      hadMax = hadMax || r === 20;
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