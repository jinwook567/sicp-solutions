import {
  is_application,
  function_expression,
  arg_expressions,
  symbol_of_name,
  is_operator_combination,
  operator_combination_to_application,
  is_conditional,
  is_lamda_expression,
  lamda_parameter_symbols,
  lamda_body,
  is_return_statement,
  is_function_declaration,
  is_declaration,
  is_assignment,
  function_decl_to_constant_decl,
  is_literal,
  literal_value,
  is_name,
} from "./sec-4.1.2.js";
import { list_of_values } from "./sec-4.1.1";

// b
export function apply(component, env) {
  const fun = function_expression(component);
  const arg_exps = arg_expressions(component);

  if (is_primitive_function(fun)) {
    return apply_primitive_function(fun, args);
  } else if (is_compound_function(fun)) {
    const result = evaluate(
      function_body(fun),
      extend_environment(
        function_parameters(fun),
        args,
        function_environment(fun)
      )
    );
    return is_return_value(result) ? return_value_content(result) : undefined;
  } else {
    error(fun, "unknown function type --apply");
  }
}
