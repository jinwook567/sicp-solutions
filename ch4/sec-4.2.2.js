import { map, error, list, head, tail, set_head, set_tail } from "../lib";
import { evaluate } from "./sec-4.1.1";
import { is_application } from "./sec-4.1.2";
import {
  function_expression,
  arg_expressions,
  function_body,
  is_conditional,
  is_tagged_list,
  conditional_predicate,
  conditional_alternative,
  conditional_consequent,
} from "./sec-4.1.2";
import {
  is_compound_function,
  extend_environment,
  function_parameters,
  function_environment,
  is_return_value,
  return_value_content,
  is_truthy,
  is_truthy,
} from "./sec-4.1.3";
import { is_primitive_function, apply_primitive_function } from "./sec-4.1.4";

function lazy_evaluate(component, env) {
  return is_application(component)
    ? lazy_apply(
        actual_value(function_expression(component), env),
        arg_expressions(component),
        env
      )
    : is_conditional(component)
    ? lazy_eval_conditional(component, env)
    : evaluate(component, env);
}

function actual_value(exp, env) {
  return force_it(lazy_evaluate(exp, env));
}

function lazy_apply(fun, args, env) {
  if (is_primitive_function(fun)) {
    return apply_primitive_function(fun, list_of_arg_values(args, env));
  } else if (is_compound_function(fun)) {
    const result = lazy_evaluate(
      function_body(fun),
      extend_environment(
        function_parameters(fun),
        list_of_delayed_args(args, env),
        function_environment(fun)
      )
    );

    return is_return_value(result) ? return_value_content(result) : undefined;
  } else {
    error(fun, "unknown function type --apply");
  }
}

function list_of_arg_values(exps, env) {
  return map((exp) => actual_value(exp, env), exps);
}

function list_of_delayed_args(exps, env) {
  return map((exp) => delay_it(exp, env), exps);
}

function lazy_eval_conditional(component, env) {
  return is_truthy(actual_value(conditional_predicate(component), env))
    ? lazy_evaluate(conditional_consequent(component), env)
    : lazy_evaluate(conditional_alternative(component), env);
}

function delay_it(exp, env) {
  return list("thunk", exp, env);
}

function is_thunk(obj) {
  return is_tagged_list(obj, "thunk");
}

function thunk_exp(thunk) {
  return head(tail(thunk));
}
function thunk_env(thunk) {
  return head(tail(tail(thunk)));
}

function is_evaluated_thunk(obj) {
  return is_tagged_list(obj, "evaluated_thunk");
}

function thunk_value(evaluated_thunk) {
  return head(tail(evaluated_thunk));
}

function force_it(obj) {
  if (is_thunk(obj)) {
    const result = actual_value(thunk_exp(obj), thunk_env(obj));
    set_head(obj, "evaluated_thunk");
    set_head(tail(obj), result);
    set_tail(tail(obj), null);
    return result;
  } else if (is_evaluated_thunk(obj)) {
    return thunk_value(obj);
  } else {
    return obj;
  }
}
