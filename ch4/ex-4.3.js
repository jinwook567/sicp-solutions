import { pair, head, tail, list, list_ref, is_null } from "../lib";
import { literal_value, symbol_of_name } from "./sec-4.1.2.js";

function evaluate(component, env) {
  const tag = head(component);
  return get("eval", tag)(env);
}

function make_table() {
  return list("*table*");
}

let table = make_table();

function put(op, type, value) {
  table = pair(list(op, type, value), table);
}

function get(op, type) {
  function iter(table) {
    if (is_null(table)) throw new Error("no item");
    return list_ref(head(table), 0) === op && list_ref(head(table), 1) === type
      ? list_ref(head(table), 2)
      : iter(tail(table));
  }

  return iter(table);
}

function install_literal_package() {
  put("eval", "literal", literal_value);
  return "done";
}

install_literal_package();

function install_name_package() {
  put("eval", "name", (env) =>
    lookup_symbol_value(symbol_of_name(component), env)
  );
}

install_name_package();

// The remaining packages are skipped in this code.
