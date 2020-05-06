const randBetween = (min, max, decimal = false) => {

  let floor = false;
  // If min or max are both integers assume we want whole numbers only
  if (!decimal && parseInt(min) === min && parseInt(max) === max) {
    max += 1;
    floor = true;
  }
  let rand = (Math.random() * (max - min)) + min;
  if (floor) {
    rand = Math.floor(rand);
  }
  return rand;
}

export {
  randBetween
};
