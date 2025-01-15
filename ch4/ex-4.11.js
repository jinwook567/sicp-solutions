import {
  is_tagged_list,
  is_sequence,
  declaration_symbol,
} from "./sec-4.1.2.js";
import { accumulate, map, list, head } from "../lib.js";

function is_constant_declaration(component) {
  return is_tagged_list(component, "constant_declaration");
}

function is_variable_declaration(component) {
  return is_tagged_list(component, "variable_declaration");
}

function scan_out_declarations(component) {
  return is_sequence(component)
    ? accumulate(
        append,
        null,
        map(scan_out_declarations, sequence_statements(component))
      )
    : is_constant_declaration(component)
    ? list(pair("constant", declaration_symbol(component)))
    : is_variable_declaration(component)
    ? list(pair("variable", declaration_symbol(component)))
    : null;
}

// extend_environment는 그대로 둔다. symbols에 constant 또는 variable 정보가 들어가있다고 가정
// types라는 할당 가능 여부를 담은 순차열을 추가로 받는 방식도 괜찮아보인다.

function assign_symbol_value(symbol, val, env) {
  function env_loop(env) {
    function scan(symbols, vals) {
      return is_null(symbols)
        ? env_loop(enclosing_environment(env))
        : symbol === head(head(symbols))
        ? tail(head(symbols)) === "variable"
          ? set_head(vals, val)
          : error("constant is not allowed to assign")
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

function assign_constant_value(symbol, val, env) {
  function env_loop(env) {
    function scan(symbols, vals) {
      return is_null(symbols)
        ? env_loop(enclosing_environment(env))
        : symbol === head(head(symbols))
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

function eval_declaration(component, env) {
  if (is_constant_declaration(component)) {
    assign_constant_value(
      declaration_symbol(component),
      evaluate(declaration_value_expression(component), env),
      env
    );
  } else {
    assign_symbol_value(
      declaration_symbol(component),
      evaluate(declaration_value_expression(component), env),
      env
    );
  }
  return undefined;
}

export function apply(fun, args) {
  if (is_primitive_function(fun)) {
    return apply_primitive_function(fun, args);
  } else if (is_compound_function(fun)) {
    const result = evaluate(
      function_body(fun),
      extend_environment(
        map(
          (parameter) => pair("variable", parameter),
          function_parameters(fun)
        ),
        args,
        function_environment(fun)
      )
    );
    return is_return_value(result) ? return_value_content(result) : undefined;
  } else {
    error(fun, "unknown function type --apply");
  }
}
