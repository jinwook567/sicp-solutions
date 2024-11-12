import { pair, is_null } from "../lib.js";
import { evaluate } from "./sec-4.1.1.js";

// left to right
function list_of_values(exps, env) {
  if (is_null(exps)) return null;

  const first = evaluate(head(exps), env);
  return pair(first, list_of_values(tail(exps), env));
}

// right to left
function list_of_values(exps, env) {
  if (is_null(exps)) return null;

  const rest = list_of_values(tail(exps), env);
  return pair(evaluate(head(exps), env), rest);
}
