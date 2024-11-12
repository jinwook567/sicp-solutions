import {
  error,
  list,
  list_ref,
  head,
  tail,
  pair,
  is_null,
  set_head,
} from "../lib";
import { is_tagged_list } from "./sec-4.1.2";

export function is_truthy(x) {
  return is_boolean(x) ? x : error(x, "boolean expected");
}

export function is_falsy(x) {
  return !is_truthy(x);
}

export function is_boolean(x) {
  return x === true || x === false;
}

export function make_function(parameters, body, env) {
  return list("compound_function", parameters, body, env);
}

export function is_compound_function(fun) {
  return is_tagged_list(fun, "compound_function");
}

export function function_parameters(fun) {
  return list_ref(fun, 1);
}

export function function_body(fun) {
  return list_ref(fun, 2);
}

export function function_environment(fun) {
  return list_ref(fun, 3);
}

export function make_return_value(content) {
  return list("return_value", content);
}

export function is_return_value(value) {
  return is_tagged_list(value, "return_value");
}

export function return_value_content(value) {
  return head(tail(value));
}

export function lookup_symbol_value(symbol, env) {
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
      return scan(frame_symbols(frame), frame_values(frame));
    }
  }
  return env_loop(env);
}

export function extend_environment(symbols, values, base_env) {
  return length(symbols) === length(values)
    ? pair(make_frame(symbols, values), base_env)
    : error(
        pair(symbols, values),
        length(symbols) < length(values)
          ? "too many arguments supplied"
          : "too few arguments supplied"
      );
}

function assign_symbol_value(symbol, val, env) {
  function env_loop(env) {
    function scan(symbols, vals) {
      return is_null(symbols)
        ? env_loop(enclosing_environment(env))
        : symbol === head(symbols)
        ? set_head(vals, val)
        : scan(tail(symbols), tail(vals));
    }
    if (env === the_empty_environment) {
      error(symbol, "unbound name --assignment");
    } else {
      const frame = first_frame(env);
      return scan(frame_symbols(frame), frame_values(frame));
    }
  }
  return env_loop(env);
}

export function enclosing_environment(env) {
  return tail(env);
}

export function first_frame(env) {
  return head(env);
}

export function make_frame(symbols, values) {
  return pair(symbols, values);
}

export function frame_symbols(frame) {
  return head(frame);
}

export function frame_values(frame) {
  return tail(frame);
}

export const the_empty_environment = null;

export function is_block(component) {
  return is_tagged_list(component, "block");
}

export function block_body(component) {
  return head(tail(component));
}

export function list_of_unassigned(symbols) {
  return map((symbol) => "*unassigned*", symbols);
}
