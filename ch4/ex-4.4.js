import { head, tail, error } from "../lib.js";
import { is_tagged_list, make_conditional_expression } from "./sec-4.1.2";

function is_logical_composition(component) {
  return is_tagged_list(component, "logical_composition");
}

function logical_operator(component) {
  return head(tail(component));
}

function logical_expression(component) {
  return head(tail(tail(component)));
}

function first_expression(component) {
  return head(logical_expression(component));
}

function second_expression(component) {
  return head(tail(logical_expression(component)));
}

function logical_composition_to_conditional(component) {
  const operator = logical_operator(component);

  return operator === "&&"
    ? and_operator_to_conditional(component)
    : operator === "||"
    ? or_operator_to_conditional(component)
    : error(operator, "unknown operator");
}

function and_operator_to_conditional(component) {
  return make_conditional_expression(
    first_expression(component),
    second_expression(component),
    false
  );
}

function or_operator_to_conditional(component) {
  return make_conditional_expression(
    first_expression(component),
    true,
    second_expression(component)
  );
}
