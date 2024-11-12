import {
  append,
  head,
  tail,
  list,
  head,
  tail,
  pair,
  is_null,
  map,
  display,
  is_pair,
} from "../lib";
import { extend_environment } from "./sec-4.1.3";
import { is_tagged_list } from "./sec-4.1.2";
import { scan_out_declaration, evaluate } from "./sec-4.1.1";
import { list_of_unassigned, is_compound_function } from "./sec-4.1.3";

function setup_environment() {
  return extend_environment(
    append(primitive_function_symbols, primitive_constant_symbols),
    append(primitive_functin_objects, primitive_constant_values)
  );
}

const the_global_envioroment = setup_environment();

function is_primitive_function(fun) {
  return is_tagged_list(fun, "primitive");
}

function primitive_implementation(fun) {
  return head(tail(fun));
}

const primitive_functions = list(
  list("head", head),
  list("tail", tail),
  list("pair", pair),
  list("is_null", is_null),
  list("+", (x, y) => x + y)
);

const primitive_function_symbols = map((f) => head(f), primitive_functions);
const primitive_functin_objects = map(
  (f) => list("primitive", head(tail(f))),
  primitive_functions
);

const primitive_constants = list(
  list("undefined", undefined),
  list("math_PI", Math.PI)
);
const primitive_constant_symbols = map((c) => head(c), primitive_constants);
const primitive_constant_values = map(
  (c) => head(tail(c)),
  primitive_constants
);

function apply_primitive_function(fun, arglist) {
  return apply_in_underlying_javascript(primitive_implementation(fun), arglist);
}

function apply_in_underlying_javascript(prim, arglist) {
  const arg_vector = [];
  let i = 0;
  while (!is_null(arglist)) {
    arg_vector[i] = head(arglist);
    i += 1;
    arglist = tail(arglist);
  }
  return prim.apply(prim, arg_vector);
}

const input_prompt = "M-evaluate input: ";
const output_prompt = "M-evaludate value: ";

function driver_loop(env) {
  const input = user_read(input_prompt);
  if (is_null(input)) {
    display("evaluator terminated");
  } else {
    const program = parse(input);
    const locals = scan_out_declaration(program);
    const unassigneds = list_of_unassigned(locals);
    const program_env = extend_environment(locals, unassigneds, env);
    const output = evaluate(program, program_env);
    user_print(output_prompt, output);
    return driver_loop(program_env);
  }
}

function user_read(prompt_string) {
  return prompt(prompt_string);
}

function user_print(string, object) {
  function prepare(object) {
    return is_compound_function(object)
      ? "< compound-function >"
      : is_primitive_function(object)
      ? "< primitivie function >"
      : is_pair(object)
      ? pair(prepare(head(object)), prepare(tail(object)))
      : object;
  }
  display(string + " " + JSON.stringify(prepare(object)));
}
