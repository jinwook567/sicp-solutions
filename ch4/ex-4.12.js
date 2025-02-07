import { is_null, head, tail } from "../lib";
import {
  enclosing_environment,
  first_frame,
  frame_symbols,
  frame_values,
} from "./sec-4.1.3";

// a
function lookup_symbol_value(symbol, env) {
  function env_loop(env) {
    function scan(symbols, values) {
      return is_null(symbols)
        ? env_loop(enclosing_environment(env))
        : symbol === head(symbols)
        ? head(values)
        : scan(tail(symbols), tail(values));
    }
    if (env === the_empty_environment) {
      error(symbol, "unbound name");
    } else {
      const frame = first_frame(env);
      const symbol_value = scan(frame_symbols(frame), frame_values(frame));

      if (symbol_value === "*unassigned*") {
        error("unassigned symbol");
      } else {
        return symbol_value;
      }
    }
  }
  return env_loop(env);
}

// b
function eval_assignment(component, env) {
  const value = evaluate(assignment_value_expression(component), env);
  if (value === "*unassigned*") {
    error("unassigned symbol");
  }
  assign_symbol_value(assignment_symbol(component), value, env);
  return value;
}
