import { map, is_null, head, tail, list, is_pair } from "../lib.js";

export function is_tagged_list(component, the_tag) {
  return is_pair(component) && head(component) === the_tag;
}

export function is_literal(component) {
  return is_tagged_list(component, "literal");
}

export function literal_value(component) {
  return head(tail(component));
}

export function make_literal(value) {
  return list("literal", value);
}

export function is_name(component) {
  return is_tagged_list(component, "name");
}

export function make_name(symbol) {
  return list("name", symbol);
}

export function symbol_of_name(component) {
  return head(tail(component));
}

export function is_application(component) {
  return is_tagged_list(component, "application");
}

export function make_application(function_expression, argument_expressions) {
  return list("application", function_expression, argument_expressions);
}

export function function_expression(component) {
  return head(tail(component));
}

export function arg_expressions(component) {
  return head(tail(tail(component)));
}

export function is_conditional(component) {
  return (
    is_tagged_list(component, "conditional_expression") ||
    is_tagged_list(component, "conditional_statement")
  );
}

export function make_conditional_expression(
  predicate,
  consequent,
  alternative
) {
  return list("conditional_expression", predicate, consequent, alternative);
}

export function conditional_predicate(component) {
  return head(tail(component));
}

export function conditional_consequent(component) {
  return head(tail(tail(component)));
}

export function conditional_alternative(component) {
  return head(tail(tail(tail(component))));
}

export function is_lamda_expression(component) {
  return is_tagged_list(component, "lamda_expression");
}

export function make_lamda_expression(parameters, body) {
  return list("lamda_expression", parameters, body);
}

export function lamda_parameter_symbols(component) {
  return map(symbol_of_name, head(tail(component)));
}

export function lamda_body(component) {
  return head(tail(tail(component)));
}

export function is_sequence(component) {
  return is_tagged_list(component, "sequence");
}

export function is_empty_sequence(stmts) {
  return is_null(stmts);
}

export function is_last_statement(stmts) {
  return is_null(tail(stmts));
}

export function sequence_statements(component) {
  return head(tail(component));
}

export function first_statement(stmts) {
  return head(stmts);
}

export function rest_statements(stmts) {
  return tail(stmts);
}

export function is_return_statement(component) {
  return is_tagged_list(component, "return_statement");
}

export function return_expression(component) {
  return head(tail(component));
}

export function is_assignment(component) {
  return is_tagged_list(component, "assignment");
}

export function assignment_value_expression(component) {
  return head(tail(tail(component)));
}

export function assignment_symbol(component) {
  return symbol_of_name(head(tail(component)));
}

export function declaration_symbol(component) {
  return symbol_of_name(head(tail(component)));
}

export function declaration_value_expression(component) {
  return head(tail(tail(component)));
}

export function make_constant_declaration(name, value_expression) {
  return list("constant_declaration", name, value_expression);
}

export function is_function_declaration(component) {
  return is_tagged_list(component, "function_declaration");
}

export function function_declaration_name(component) {
  return head(tail(component));
}

export function function_declaration_parameters(component) {
  return head(tail(tail(component)));
}

export function function_declaration_body(component) {
  return head(tail(tail(tail(component))));
}

export function is_declaration(component) {
  return (
    is_tagged_list(component, "constant_declaration") ||
    is_tagged_list(component, "variable_declaration") ||
    is_tagged_list(component, "function_declaration")
  );
}

export function function_decl_to_constant_decl(component) {
  return make_constant_declaration(
    function_declaration_name(component),
    make_lamda_expression(
      function_declaration_parameters(component),
      function_declaration_body(component)
    )
  );
}

export function is_unary_operator_combination(component) {
  return is_tagged_list(component, "unary_operator_combination");
}

export function is_binary_operator_combination(component) {
  return is_tagged_list(component, "binary_operator_combination");
}

export function is_operator_combination(component) {
  return (
    is_unary_operator_combination(component) ||
    is_binary_operator_combination(component)
  );
}

export function operator_symbol(component) {
  return head(tail(component));
}

export function first_operand(component) {
  return head(head(tail(tail(component))));
}

export function second_operand(component) {
  return head(tail(head(tail(tail(component)))));
}

export function operator_combination_to_application(component) {
  const operator = operator_symbol(component);
  return is_unary_operator_combination(component)
    ? make_application(make_name(operator), list(first_operand(component)))
    : make_application(
        make_name(operator),
        list(first_operand(component), second_operand(component))
      );
}
