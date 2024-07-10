function square(n) {
  return n * n;
}

function cube(n) {
  return n * n * n;
}

function abs(n) {
  return Math.abs(n);
}

function improve(guess, x) {
  return (x / square(guess) + 2 * guess) / 3;
}

function is_good_enough(guess, x) {
  return Math.abs(cube(guess) / x - 1) < 0.001;
}

function cbrt_iter(guess, x) {
  return is_good_enough(guess, x) ? guess : cbrt_iter(improve(guess, x), x);
}

function cbrt(n) {
  return cbrt_iter(1, n);
}
