import { pair, head, tail, is_null, map } from "../lib";

function make_frame(symbols, values) {
  if (is_null(symbols)) {
    return null;
  } else {
    return pair(
      pair(head(symbols), head(values)),
      make_frame(tail(symbols), tail(values))
    );
  }
}

function frame_symbols(frame) {
  return map(head, frame);
}

function frame_values(frame) {
  return map(tail, frame);
}
