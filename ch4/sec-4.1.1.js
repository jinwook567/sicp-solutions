import { map, accumulate, append, list, error } from "../lib.js";
import { lookup_symbol_value } from "./sec-4.1.3.js";
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
  declaration_symbol,
} from "./sec-4.1.2.js";
import {
  is_sequence,
  is_block,
  make_function,
  block_body,
  make_return_value,
  is_return_value,
  return_value_content,
  list_of_unassigned,
} from "./sec-4.1.3.js";

export function evaluate(component, env) {
  return is_literal(component)
    ? literal_value(component)
    : is_name(component)
    ? lookup_symbol_value(symbol_of_name(component), env)
    : is_application(component)
    ? apply(
        evaluate(function_expression(component), env),
        list_of_values(arg_expressions(component), env)
      )
    : is_operator_combination(component)
    ? evaluate(operator_combination_to_application(component), env)
    : is_conditional(component)
    ? eval_conditional(component, env)
    : is_lamda_expression(component)
    ? make_function(
        lamda_parameter_symbols(component),
        lamda_body(component),
        env
      )
    : is_sequence(component)
    ? eval_sequence(sequence_statements(component), env)
    : is_block(component)
    ? eval_block(component, env)
    : is_return_statement(component)
    ? eval_return_statement(component, env)
    : is_function_declaration(component)
    ? evaluate(function_decl_to_constant_decl(component), env)
    : is_declaration(component)
    ? eval_declaration(component, env)
    : is_assignment(component)
    ? eval_assignment(component, env)
    : error(component, "unknown syntax --evalute");
}

export function apply(fun, args) {
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

export function list_of_values(exps, env) {
  return map((arg) => evaluate(arg, env), exps);
}

export function eval_conditional(component, env) {
  return is_truthy(evaluate(conditional_predicate(component), env))
    ? evaluate(conditional_consequent(component), env)
    : evaluate(conditional_alternative(component), env);
}

function eval_sequence(stmts, env) {
  if (is_empty_sequence(stmts)) {
    return undefined;
  } else if (is_last_statement(stmts)) {
    return evaluate(first_statement(stmts), env);
  } else {
    const first_stmt_value = evaluate(first_statement(stmts), env);
    if (is_return_value(first_stmt_value)) {
      return first_stmt_value;
    } else {
      return eval_sequence(rest_statements(stmts), env);
    }
  }
}

function eval_block(component, env) {
  const body = block_body(component);
  const locals = scan_out_declarations(body);
  const unassigneds = list_of_unassigned(locals);
  return evaluate(body, extend_environment(locals, unassigneds, env));
}

export function scan_out_declarations(component) {
  return is_sequence(component)
    ? accumulate(
        append,
        null,
        map(scan_out_declarations, sequence_statements(component))
      )
    : is_declaration(component)
    ? list(declaration_symbol(component))
    : null;
}

function eval_return_statement(component, env) {
  return make_return_value(evaluate(return_expression(component), env));
}

function eval_assignment(component, env) {
  const value = evaluate(assignment_value_expression(component), env);
  assign_symbol_value(assignment_symbol(component), value, env);
  return value;
}

function eval_declaration(component, env) {
  assign_symbol_value(
    declaration_symbol(component),
    evaluate(declaration_value_expression(component), env),
    env
  );
  return undefined;
}
