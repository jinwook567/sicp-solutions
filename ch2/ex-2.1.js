import { pair } from "../lib";

function gcd(a, b) {
    // ..최대 공약수를 반환한다.
}

function make_rat(n, d) {
    const rn = d < 0 ? -n : n
    const rd = n > 0 && d < 0 ? -d : d
    const g = gcd(rn, rd)
    return pair(rn / g, rd / g)
}
