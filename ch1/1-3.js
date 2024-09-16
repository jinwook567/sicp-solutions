function square(n) {
  return n * n;
}

function sum_square(a, b) {
  return square(a) + square(b);
}

function solution(a, b, c) {
  return a < b && a < c
    ? sum_square(b, c)
    : b < c && b < a
    ? sum_square(a, c)
    : sum_square(a, b);
}
