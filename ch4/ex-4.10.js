import { is_null, head, tail, list_ref, set_head } from "../lib.js";
import { frame_symbols, frame_values } from "./sec-4.1.3";

function some(f, items) {
  return is_null(items) ? null : f(head(items)) || some(f, tail(items));
}

function ref(predicate, items) {
  return is_null(items)
    ? -1
    : predicate(head(items))
    ? 0
    : 1 + ref(predicate, tail(items));
}

function traverse(env, symbol) {
  return some((frame) => {
    const n = ref(
      (frame_symbol) => frame_symbol === symbol,
      frame_symbols(frame)
    );
    return n >= 0 ? list_ref(frame_values(frame), n) : null;
  }, env);
}

function assign_symbol_value(symbol, val, env) {
  const vals = traverse(env, symbol);
  if (is_null(vals)) {
    error(symbol, "unbound name");
  } else {
    set_head(vals, val);
  }
}

function lookup_symbol_value(symbol, env) {
  const vals = traverse(env, symbol);
  if (is_null(vals)) {
    error(symbol, "unbound name");
  } else {
    return head(vals);
  }
}
