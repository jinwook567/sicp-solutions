import { pair, head, tail, is_null, map, error } from "../lib";
import { enclosing_environment } from "./sec-4.1.3";

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

function assign_symbol_value(symbol, val, env) {
  function env_loop(env) {
    function scan(frame) {
      return is_null(frame)
        ? env_loop(enclosing_environment(env))
        : symbol === head(frame_symbols(frame))
        ? set_head(frame, pair(symbol, val))
        : scan(tail(frame));
    }
    if (env === null) {
      error(symbol, "unbound name");
    } else {
      const frame = first_frame(env);
      return scan(frame);
    }
  }
  return env_loop(env);
}
